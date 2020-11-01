const path = require("path");
const express = require("express");
const xss = require("xss");
const LearningTracksService = require("./learning-tracks-service");

const learningTracksRouter = express.Router();
const jsonParser = express.json();

const serializeLearningTrack = (learningTrack) => ({
    id: learningTrack.id,
    title: xss(learningTrack.title),
});

//GET
learningTracksRouter.route("/").get((req, res, next) => {
    const knexInstance = req.app.get("db");
    LearningTracksService.getAllLearningTracks(knexInstance)
        .then((learningTracks) => {
            res.json(learningTracks.map(serializeLearningTrack));
        })
        .catch(next);
});
//GET by ID
learningTracksRouter
    .route("/:learningTrack_id")
    .all((req, res, next) => {
        const { learningTrack_id } = req.params;
        const knexInstance = req.app.get("db");
        LearningTracksService.getById(knexInstance, learningTrack_id)
            .then((learningTrack) => {
                if (!learningTrack) {
                    return res.status(404).json({
                        error: { message: `Learning Track doesn't exist` },
                    });
                }
                res.learningTrack = learningTrack;
                next();
            })
            .catch(next);
    })
    .get((req, res) => {
        res.json(serializeLearningTrack(res.learningTrack));
    });

module.exports = learningTracksRouter;
