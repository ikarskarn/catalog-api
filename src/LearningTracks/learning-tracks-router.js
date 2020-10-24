const path = require('path');
const express = require('express');
const xss = require('xss');
const LearningTracksService = require('./learning-tracks-service')

const LearningTracksRouter = express.Router()
const jsonParser = express.json()

const serializeLearningTrack = learningTrack => ({
  id: learningTrack.id,
  title: xss(learningTrack.title)
})

LearningTracksRouter
.route('/')
.get((req, res, next) => {
    const knexInstance = req.app.get('db')
    LearningTracksService.getAllLearningTracks(knexInstance)
    .then(learningTracks => {
        res.json(learningTracks.map(serializeLearningTrack))
    })
    .catch(next)
})
.post(jsonParser, (req, res, next) => {
    const { title } = req.body
    const newLearningTrack = { title }

    for (const [key, value] of Object.entries(newLearningTrack)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })
        }
    }

    LearningTracksService.insertLearningTrack(
        req.app.get('db'),
        newLearningTrack
    )
    .then(learningTrack => {
        res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${learningTrack.id}`))
        .json(serializeLearningTrack(learningTrack))
    })
    .catch(next)
})

LearningTracksRouter
.route('/:learning-track_id')
.all((req, res, next) => {
    LearningTracksService.getById(
        req.app.get('db'),
        req.params.learning-track_id
    )
    .then(learningTrack => {
        if (!learningTrack) {
            return res.status(404).json({
                error: { message: `Learning Track doesn't exist` }
            })
        }
        res.learningTrack = learningTrack
        next()
    })
    .catch(next)
})
.get((req, res, next) => {
    res.json(serializeLearningTrack(res.learningTrack))
})
.delete((req, res, next) => {
    LearningTracksService.deleteLearningTrack(
        req.app.get('db'),
        req.params.learning-track_id
    )
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})
.patch(jsonParser, (req, res, next) => {
    const { title } = req.body
    const learningTrackToUpdate = { title }

    const numberOfValues = Object.values(learningTrackToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
        return res.status(400).json({
            error: {
                message: `Request body must contain 'title'`
            }
        })
    }

    LearningTracksService.updateLearningTrack(
        req.app.get('db'),
        req.params.learning-track_id,
        learningTrackToUpdate
    )
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})

module.exports = LearningTracksRouter