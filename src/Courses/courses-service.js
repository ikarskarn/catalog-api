const CoursesService = {
    getAllCourses(knex) {
        return knex.select("*").from("catalog_courses");
    },
    insertCourse(knex, newCourse) {
        return knex.insert(newCourse).into("catalog_courses").returning("*");
    },
    getById(knex, id) {
        return knex.from("catalog_courses").select("*").where("id", id).first();
    },
    deleteCourse(knex, id) {
        return knex("catalog_courses").where({ id }).delete();
    },
    updateCourse(knex, id, newCourseFields) {
        return knex("catalog_courses").where({ id }).update(newCourseFields);
    },
};

module.exports = CoursesService;
