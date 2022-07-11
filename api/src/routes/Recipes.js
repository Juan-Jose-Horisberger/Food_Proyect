const express = require('express');
const router = express();
const { getAllInfo, recipeById, addInfo, getRecipesForDiet, orderByName } = require('../controllers/Recipes.controller.js');



// GET

router.get('/', getAllInfo);
router.get('/?name=', getAllInfo);
router.get('/:id', recipeById);
// router.get('/diet/:diet', getRecipesForDiet);
router.get('/name/:order', orderByName)

// POST

router.post('/create', addInfo);

// PUT


// DELETE

module.exports = router;