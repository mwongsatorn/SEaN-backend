const Joi = require("joi");

const userSchema = Joi.object({
    username: Joi.string().min(8),
    password: Joi.string().min(8),
    firstname: Joi.string(),    
    lastname: Joi.string(),
    email: Joi.string()
        .email(),
    status_id: Joi.string(),
    status: Joi.string(),
    faculty: Joi.string(),
    department: Joi.string(),
    tel_no: Joi.string()
})

const eventSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string()
        .max(4000),
    type: Joi.string()
        .valid('Force', 'Regular', 'Volunteer', 'Others'),
    faculty: Joi.string(),
    department: Joi.string(),
    start_date: Joi.date(),
    end_date: Joi.date(),
    member_amount: Joi.number(),
    location: Joi.string(),
})

const newsSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    short_description: Joi.string(),
    approvedBy: Joi.string(),
    comment: Joi.string(),
})

const announcementSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string()
})

module.exports = {
    userSchema,
    eventSchema,
    newsSchema,
    announcementSchema,
}
  