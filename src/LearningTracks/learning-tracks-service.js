const LearningTracksService = {
    //get all learning tracks (GET)
    getAllLearningTracks(knex) {
        return knex.select("*").from("catalog_learning_tracks");
    },
    //get learning track by id (GET)
    getById(knex, id) {
        return knex.from("catalog_learning_tracks").select("*").where("id", id).first();
    },
};

module.exports = LearningTracksService;
