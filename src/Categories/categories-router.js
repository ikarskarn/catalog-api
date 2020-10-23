const path = require('path')
const express = require('express')
const xss = require('xss')
const CategoriesService = require('./categories-service')

const CategoriesRouter = express.Router()
const jsonParser = express.json()

const serializeCategories = category => ({
    id: category.id,
    title: xss(category.title),
})

CategoriesRouter
.route('/categories')
.get((req, res, next) => {
    const knexInstance = req.app.get('db')
    CategoriesService.getAllCategories(knexInstance)
    .then(categories => {
        res.json(categories.map(serializeCategories))
    })
    .catch(next)
})
.post(jsonParser, (req, res, next) => {
    const { title } = req.body
    const newCategory = { title }
    
    for (const [key, value] of Object.entries(newCategory)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })
        }
    }

    CategoriesService.insertCategory(
        req.app.get('db'),
        newCategory
    )
    .then(category => {
        res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${category.id}`))
        .json(serializeCategories(category))
    })
    .catch(next)
})

CategoriesRouter
.route('/:category_id')
.all((req, res, next) => {
    CategoriesService.getById(
        req.app.get('db'),
        req.params.category_id
    )
    .then(category => {
        if (!category) {
            return res.status(404).json({
                error: { message: `Category doesn't exist` }
            })
        }
        res.category = category
        next()
    })
    .catch(next)
})
.get((req, res, next) => {
    res.json({
        id: res.category.id,
        title: xss(res.category.title),
    })
})
.delete((req, res, next) => {
    CategoriesService.deleteCategory(
        req.app.get('db'),
        req.params.category_id
    )
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})
.patch(jsonParser, (req, res, next) => {
    const { title } = req.body
    const categoryToUpdate = { title }

    const numberOfValues = Object.values(categoryToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
        return res.status(400).json({
            error: {
                message: `Request body must contain 'title'`
            }
        })
    }
    CategoriesService.updateCategory(
        req.app.get('db'),
        req.params.category_id,
        categoryToUpdate
    )
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})

module.exports = CategoriesRouter