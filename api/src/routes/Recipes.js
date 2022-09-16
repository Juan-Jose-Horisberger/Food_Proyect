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
        // if (name) {
        //     recipesDB = await Recipe.findAll({ where: { name: { [Op.iLike]: `%${name}%` } }, include: [{ model: Diet }] });
        // } else {
        //     recipesDB = await Recipe.findAll({ include: [{ model: Diet }] });
        // }

        // if (recipesDB.length) {
        //     res.status(200).send(recipesDB);
        // }
        // else {
        //     res.status(200).send(recipesDB);
        // }


        const { name } = req.query;

        const allTheRecipes = await Recipe.findAll({ include: Diet });
        if (name) {
            const recipes = await Recipe.findAll({ where: { name: { [Op.iLike]: `%${name}%` } }, include: [{ model: Diet }] });
            recipes.length
                ? res.send(recipes)
                : res.status(400).json({ messaje: 'Error that recipe does not exist' });
        }
        else if (allTheRecipes.length) {
            res.send(allTheRecipes)
        }



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