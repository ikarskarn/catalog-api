const path = require("path");
const express = require("express");
const xss = require("xss");
const CategoriesService = require("./categories-service");

const categoriesRouter = express.Router();
const jsonParser = express.json();

const serializeCategory = (category) => ({
    id: category.id,
    title: xss(category.title),
});

//api endpoints
//GET & POST
categoriesRouter
    .route("/")
    .get((req, res, next) => {
        const knexInstance = req.app.get("db");
        CategoriesService.getAllCategories(knexInstance)
            .then((categories) => {
                res.json(categories.map(serializeCategory));
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { title } = req.body;
        const newCategory = { title };

        for (const [key, value] of Object.entries(newCategory)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` },
                });
            }
        }

        CategoriesService.insertCategory(req.app.get("db"), newCategory)
            .then((category) => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${category.id}`))
                    .json(serializeCategory(category));
            })
            .catch(next);
    });

//GET by ID and Delete
categoriesRouter
    .route("/:category_id")
    .all((req, res, next) => {
        const { category_id } = req.params;
        const knexInstance = req.app.get("db");
        CategoriesService.getById(knexInstance, category_id)
            .then((category) => {
                if (!category) {
                    return res.status(404).json({
                        error: { message: `Category doesn't exist` },
                    });
                }
                res.category = category;
                next();
            })
            .catch(next);
    })
    .get((req, res) => {
        res.json(serializeCategory(res.category));
    })
    .delete((req, res, next) => {
        const { category_id } = req.params;
        const knexInstance = req.app.get("db");
        CategoriesService.deleteCategory(knexInstance, category_id)
            .then(res.status(204).end())
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const { title } = req.body;
        const categoryToUpdate = { title };

        const numberOfValues = Object.values(categoryToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'title'`,
                },
            });
        }

        CategoriesService.updateCategory(
            req.app.get("db"),
            req.params.category_id,
            categoryToUpdate
        )
            .then(res.status(204).end())
            .catch(next);
    });

module.exports = categoriesRouter;
