
const ProjectModel = require('./project.model');
const UserModel = require('../user/user.model');
const mongoose = require('mongoose');
const path = require('path');
const fs = require("fs");
const { customErrorHandler } = require('../../helpers/error.helper');

exports.create = async function(req, res) {
    try {
        const {userId} = req.userData
        const {name} = req.body

        const project = await ProjectModel.findOne({name: name,user: mongoose.Types.ObjectId(userId)})
        console.log(project,'pososo')
        if(project){
            const statusCode = await customErrorHandler("project name")

            return res.status(statusCode).send({
                success: false,
                message: "Project with the name already exists"
            })
            
        }

        req.body["user"] = mongoose.Types.ObjectId(userId)
        await ProjectModel.create(req.body)

        res.send({
            success: true,
            message: "Successfull"
        })
    }catch (e) {
        const statusCode = await customErrorHandler(e.message)

        res.status(statusCode).send({
            success: false,
            message: e.message,
        })
    }
}

exports.fetchAll = async function(req,res){
    try{
        const {userId} = req.userData

        const {type} = req.params
        console.log(req.params,userId,type,'sdsd')
        let projects

        if(type == "current"){
            projects = await ProjectModel.find({user:  mongoose.Types.ObjectId(userId),status: "current"}).select('_id name techStacks status description liveUrl repoLink image')
            console.log(projects,'oososo')
        }
        else if(type == "archived"){
            projects = await ProjectModel.find({user:  mongoose.Types.ObjectId(userId),status: "archived"}).select('_id name techStacks status description liveUrl repoLink image')
        }else if(type == "completed"){
            projects = await ProjectModel.find({user:  mongoose.Types.ObjectId(userId),status: "completed"}).select('_id name techStacks status description liveUrl repoLink image')
        }else{
            return res.send({success: false,message: 'Invalid Type'})
        }
        

        res.send({
            success: true, data: projects
        })
    }catch (e) {
        const statusCode = await customErrorHandler(e.message)

        res.status(statusCode).send({
            success: false,
            message: e.message,
        })
    }
}

exports.changeStatus = async function(req,res){
    try{
        const {userId} = req.userData
        const {projectId,status} = req.body

        const project = await ProjectModel.findOne({user:  mongoose.Types.ObjectId(userId),_id: projectId})

        if(!project){
            return res.send({
                success: false,
                messaage: "Project Not Found"
            })
        }
        let data

        if(status == "archived"){
            data = await ProjectModel.updateOne({user:  mongoose.Types.ObjectId(userId),_id: projectId},{status: 'archived'})
        }

        else if(status == "completed"){
            data = await ProjectModel.updateOne({user:  mongoose.Types.ObjectId(userId),_id: projectId},{status: 'completed'})
        }

        else{
            return res.send({success: false,message: 'Invalid Type'})
        }
        console.log('yooyoy')
        res.send({
            success: true, message: 'Successfull'
        })
    }catch (e) {
        const statusCode = await customErrorHandler(e.message)

        res.status(statusCode).send({
            success: false,
            message: e.message,
        })
    }
}

exports.update = async function(req,res) {
    try{
        const {userId} = req.userData
        const {projectId} = req.body
      
        await ProjectModel.updateOne({user:  mongoose.Types.ObjectId(userId),_id: projectId},req.body)

        res.send({
            success: true, message: 'Successfull'
        })
    }catch (e) {
        const statusCode = await customErrorHandler(e.message)

        res.status(statusCode).send({
            success: false,
            message: e.message,
        })
    }
}

exports.searchCriteria = async function(req,res){
    try{
        const {userId} = req.userData
        const { sortBy,sortOrder, filterBy, filterValue,type } = req.query;

        console.log(req.query,'reqqqq')
        let sortCriteria = {};
        if (sortBy === 'az') {
            sortCriteria = { name: 1 }; 
        } else if (sortBy === 'za') {
            sortCriteria = { name: -1 }; 
        } 

        if (sortOrder === 'newest') {
            sortCriteria["startDate"] = -1  
        } else if (sortOrder === 'oldest') {
            sortCriteria["startDate"]= 1 
        }

        let query = {};
        if (filterBy === 'name') {
            query = { name: { $regex: new RegExp(filterValue, 'i') } }; 
        } else if (filterBy === 'techStacks') {
            query = { techStacks: { $in: filterValue } };
        }

        query["user"] = userId
        query["status"] = type

        console.log(query,sortCriteria,'qurerer')
        
        const projects = await ProjectModel.find(query).sort(sortCriteria);

        res.status(200).json({ success: true, data:projects });
    }catch (e) {
        const statusCode = await customErrorHandler(e.message)

        res.status(statusCode).send({
            success: false,
            message: e.message,
        })
    }
}
  
