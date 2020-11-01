const knex = require("knex");
const app = require("../src/app");

describe("Category Endpoints", function () {
    let db;

    before("make knex instance", () => {
        db = knex({
            client: "pg",
            connection: process.env.DATABASE_URL,
        });
        app.set("db", db);
    });

    describe(`GET /api/categories`, () => {
        context("Given there are categories in the database", () => {
            it("responds with 200 and all of the categories", () => {
                return supertest(app).get("/api/categories").expect(200);
            });
        });
    });

    describe(`GET /api/learning-tracks`, () => {
        context("Given there are learning tracks in the database", () => {
            it("responds with 200 and all of the learning tracks", () => {
                return supertest(app).get("/api/learning-tracks").expect(200);
            });
        });
    });

    describe(`GET /api/courses`, () => {
        context("Given there are courses in the database", () => {
            it("responds with 200 and all of the courses", () => {
                return supertest(app).get("/api/courses").expect(200);
            });
        });
    });

    describe(`GET /api/courses/:courses_id`, () => {
        context(`Given bad course id`, () => {
            it(`responds with 404`, () => {
                const courseId = 123456;
                return supertest(app)
                    .get(`/api/courses/${courseId}`)
                    .expect(404, { error: { message: `Course doesn't exist` } });
            });
        });
    });
});
