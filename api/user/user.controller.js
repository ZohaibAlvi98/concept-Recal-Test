'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

// const UserService = require('./user.service');
const UserModel = require('./user.model'); 
const { customErrorHandler } = require('../../helpers/error.helper');
// const UtilService = require('../utility/util');
// const htmlTemplateService = require('../utility/htmltemplates');
// const UserSession = require('../userSession/userSession.model'); 
// const _ = require('lodash');


function handleError(res,error,code){
    res.status(code).send({success: false, message:error.message.split(',')[0]});
}

exports.create = async function(req,res){
    try{
        req.body.role = "user";
        const user = await UserModel.create(req.body)

        res.send({success: true,message: 'User created'})
    }catch (error) {
        if (error.name === 'ValidationError') {
            // Handling validation errors
            const errorMessage = Object.values(error.errors).map(e => e.message).join(', ');
            res.status(400).send({ success: false, message: errorMessage });
        } else if (error.code === 11000 && error.keyValue.email) {
            // Handling duplicate key error (assuming email is a unique field)
            res.status(400).send({ success: false, message: 'The specified email address is already in use.' });
        } else {
            // For other types of errors
            console.error(error);
            res.status(500).send({ success: false, message: 'Internal server error' });
        }
    }
};

exports.login = async function(req, res){
    try{
        console.log(req.params)
        let {email, password} = req.body
        console.log(req.body)
        await UserModel.findOne({
            email
        },async (err,user)=>{
            if(err){
                res.send({
                    success: false,
                    message: err
                })    
            }
            if(user!=null){
                
                if(user.authenticate(password)){
                    const secret = process.env.JWT_SECRET
                    const expires = process.env.JWT_EXPIRES
                    const algo = process.env.JWT_ALGO
                    
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    }, secret, {
                        expiresIn: expires,
                        algorithm: algo
                    })
                    let _user = {
                        liveUrl: user.liveUrl,
                        repoUrl: user.repoUrl
                    } 
                    res.send({success: true, token: token, message: 'Successfull Login',user:_user})
                    // userSessionModel.create({user: user._id}, (err, raw)=>{ 
                        
                    //     res.send({success: true, token: raw._id, user, message: 'Successfull Login'})
                    // })
                   
                }else{
                    const statusCode = await customErrorHandler("incorrect")
                    return res.status(statusCode).send({
                        success:false,
                        message: "Incorrect password"
                    })
                }
            }else{
                const statusCode = await customErrorHandler("incorrect")
                    return res.status(statusCode).send({
                        success:false,
                        message: "User Not Found"
                    })
            }
        })
    }catch(e){
        const statusCode = await customErrorHandler(e.message)
        return res.status(statusCode).send({
            success:false,
            message:e.message
        })
    } 
}


exports.users = async function(req, res){
    try{
        await UserModel.find({},async(err,users)=>{
            res.send({
                users:users
            })

    })
    }catch(e){
        const statusCode = await customErrorHandler(e.message)
        return res.status(statusCode).send({
            success:false,
            message:e.message
        })
    } 

}

exports.fetch = async function(req,res){
    try {
        let data = {
            ...req.userData,
        }
        delete data.userId

        res.send({
            success: true,
            user: data,
        })
    } catch (e) {
        const statusCode = await customErrorHandler(e.message)

        res.status(statusCode).send({
            success: false,
            message: e.message,
        })
    }
}