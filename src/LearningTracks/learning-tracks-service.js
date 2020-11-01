const LearningTracksService = {
    getAllLearningTracks(knex) {
        return knex.select("*").from("catalog_learning_tracks");
    },
    insertLearningTrack(knex, newLearningTrack) {
        return knex.insert(newLearningTrack).into("catalog_learning_tracks").returning("*");
    },
    getById(knex, id) {
        return knex.from("catalog_learning_tracks").select("*").where("id", id).first();
    },

    deleteLearningTrack(knex, id) {
        return knex("catalog_learning_tracks").where({ id }).delete();
    },

    updateLearningTrack(knex, id, newLearningTrackFields) {
        return knex("catalog_learning_tracks").where({ id }).update(newLearningTrackFields);
    },
};

module.exports = LearningTracksService;
