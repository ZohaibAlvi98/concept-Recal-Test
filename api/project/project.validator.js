const Joi = require('joi');
const { validateRequest } = require('../../helpers/validator.helper')

exports.create = async function createUser(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().allow(null, '').default(null),
        startDate: Joi.string().required(),
        liveUrl: Joi.string().allow(null, '').default(null),
        techStacks: Joi.string().allow(null, ''),
        repoLink: Joi.string().allow(null, '').default(null)

    })
    validateRequest(req, next, schema, res)
}

exports.update = async function createUser(req, res, next) {
    const schema = Joi.object({
        projectId: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().allow(null, '').default(null),
        startDate: Joi.string().required(),
        liveUrl: Joi.string().allow(null, '').default(null),
        techStacks: Joi.string().allow(null, ''),
        repoLink: Joi.string().allow(null, '').default(null)

    })
    validateRequest(req, next, schema, res)
}