const express = require('express');
const router = express.Router();
const {
    getVideoGames,
    addVideoGames,
    updateVideoGame,
    deleteVideoGame
} = require('../../data/videogames')

/* GET video games listing. */
router.get('/', async function (req, res, next) {
    try {
        const data = await getVideoGames();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Issue, check logs');
    }
});

/* POST video game Creation */
router.post('/', async function (req, res, next) {
    try {
        const data = await addVideoGames(req.body);
        res.send(data);
    } catch (err) {
        if (err.error) {
            res.status(400).send(err);
        } else {
            console.log(err);
            res.status(500).send('Internal Server Issue, check logs');
        }
    }
});

/* PATCH video game Update */
router.patch('/:id', async function (req, res, next) {
    try {
        const data = await updateVideoGame(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        if (err.error) {
            res.status(400).send(err);
        } else {
            console.log(err);
            res.status(500).send('Internal Server Issue, check logs');
        }
    }
})

/* DELETE article Deletion */
router.delete('/:id', async function (req, res, next) {
    try {
        const data = await deleteVideoGame(req.params.id);
        res.send(data);
    } catch (err) {
        if (err.error) {
            res.status(400).send(err);
        } else {
            console.log(err);
            res.status(500).send('Internal Server Issue, check logs');
        }
    }
})

module.exports = router;