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
categoriesRouter.route("/").get((req, res, next) => {
    const knexInstance = req.app.get("db");
    CategoriesService.getAllCategories(knexInstance)
        .then((categories) => {
            res.json(categories.map(serializeCategory));
        })
        .catch(next);
});

//GET by ID and DELETE
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
    });

module.exports = categoriesRouter;
