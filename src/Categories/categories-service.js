const CategoriesService = {
    //Get All (GET) Categories
    getAllCategories(knex) {
        return knex.select("*").from("catalog_categories");
    },

    //get by id (GET)
    getById(knex, id) {
        return knex.from("catalog_categories").select("*").where("id", id).first();
    },
};

module.exports = CategoriesService;
