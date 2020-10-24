const CategoriesService = {
	
	getAllCategories(knex) {
		return knex.select('*').from('catalog_categories')
	},

	insertCategory(knex, newCategory) {
		return knex
		.insert(newCategory)
		.into('catalog_categories')
		.returning('*')
		.then(rows => {
			return rows[0]
		})
	},

	getById(knex, id) {
		return knex.from('catalog_categories').select('*').where('id', id).first()
	},

	deleteCategory(knex, id) {
		return knex('catalog_categories')
		.where({ id })
		.delete()
	},

	updateCategory(knex, id, newCategoryFields) {
		return knex('catalog_categories')
		.where({ id })
		.update(newCategoryFields)
	},

}

module.exports = CategoriesService;