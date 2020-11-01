const CoursesService = {
    //get all courses (GET)
    getAllCourses(knex) {
        return knex.select("*").from("catalog_courses");
    },
    //add course (POST)
    insertCourse(knex, newCourse) {
        return knex.insert(newCourse).into("catalog_courses").returning("*");
    },
    //get by id (GET)
    getById(knex, id) {
        return knex.from("catalog_courses").select("*").where("id", id).first();
    },
    //delete course (DELETE)
    deleteCourse(knex, id) {
        return knex("catalog_courses").where({ id }).delete();
    },
};

module.exports = CoursesService;
