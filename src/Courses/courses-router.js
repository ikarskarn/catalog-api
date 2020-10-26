const path = require('path');
const express = require('express');
const xss = require('xss');
const CoursesService = require('./courses-service');

const coursesRouter = express.Router();
const jsonParser = express.json();

const serializeCourse = course => ({
    id: course.id,
    category_id: parseInt(course.category_id),
    title: xss(course.title),
    course_code: xss(course.course_code),
    learning_track_id: parseInt(course.learning_track_id),
    certification: xss(course.certification),
    course_description: xss(course.course_description)
})

coursesRouter
.route('/')
.get((req, res, next) => {
    const knexInstance = req.app.get('db')
    CoursesService.getAllCourses(knexInstance)
    .then(courses => {
        res.json(courses.map(serializeCourse))
    })
    .catch(next)
})
.post(jsonParser, (req, res, next) => {
    const { category_id, title, course_code, learning_track_id, certification, course_description } = req.body
    const newCourse = { category_id, title, course_code, learning_track_id, certification, course_description }

    for (const [key, value] of Object.entries(newCourse)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })
        }
    }

    CoursesService.insertCourse(
        req.app.get('db'),
        newCourse
    )
    .then(course => {
        res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${course.id}`))
        .json(serializeCourse(course))
    })
    .catch(next)
})

coursesRouter
.route('/:course_id')
.all((req, res, next) => {
    const knexInstance = req.app.get('db')
    CoursesService.getById(knexInstance, req.params.course_id)
    .then(course => {
        if (!course) {
            return res.status(404).json({
                error: { message: `Course doesn't exist` }
            })
        }
        res.course = course
        next()
    })
    .catch(next)
})
.get((req, res) => {
    res.json(serializeCourse(res.course))
})
.delete((req, res, next) => {
    const knexInstance = req.app.get('db')
    CoursesService.deleteCourse(
        knexInstance,
        req.params.course_id
    )
    .then(res.status(204).end())
    .catch(next)
})
.patch(jsonParser, (req, res, next) => {
    const { category_id, title, course_code, learning_track_id, certification, course_description } = req.body
    const courseToUpdate = { category_id, title, course_code, learning_track_id, certification, course_description }

    const numberOfValues = Object.values(courseToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
        return res.status(400).json({
            error: {
                message: `Request body must contain 'category', 'title', 'course_code', 'learning_track_id', 'certification', and 'course_description'`
            }
        })
    }

    CoursesService.updateCourse(
        req.app.get('db'),
        req.params.course_id,
        courseToUpdate
    )
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})

module.exports = coursesRouter