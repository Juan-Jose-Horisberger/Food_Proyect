const express = require('express');
const router = express();
const { Recipe, Diet } = require("../db.js");
const { Op } = require("sequelize");
const { getAllInfo, recipeById, addInfo, orderByName } = require('../controllers/Recipes.controller.js');



// GET

// router.get('/', getAllInfo);

router.get("/", async (req, res) => {

    const { name } = req.query;

    try {
        let recipesDB;

        // si tengo query filtro sobre ella
        if (name) {
            recipesDB = await Recipe.findAll({ where: { name: { [Op.iLike]: `%${name}%` } }, include: [{ model: Diet }] });
            res.send(recipesDB)
        } else if (!name) {
            recipesDB = await Recipe.findAll({ include: [{ model: Diet }] });
            res.send(recipesDB)
        }
        else {
            res.status(404).send({ error: "Recipe not found!" });
        }

        // return res.status(200).send(recipesDB);

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});



router.get('/:id', recipeById);
router.get('/name/:order', orderByName)

// POST

router.post('/create', addInfo);

// PUT


// DELETE

module.exports = router;