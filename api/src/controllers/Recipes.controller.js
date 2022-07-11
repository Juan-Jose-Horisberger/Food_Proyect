require('dotenv').config();
const { YOUR_API_KEY } = process.env;
const { Op } = require('sequelize');
const axios = require('axios');
const { Recipe, Diet } = require('../db.js'); //Models
const { Router, json } = require('express');
const router = Router();
router.use(json());

//http://localhost:3001/recipe/get en postman

//GET

const getAllInfo = async (req, res, next) => {
    try {
        //Info por query //52:47
        const { name } = req.query;

        //Traemos la info de la api
        const api = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${YOUR_API_KEY}&addRecipeInformation=true&number=100`);

        //Traemos la info de la bd


        //De esta forma no funciona ya que le agregamos, un {} y de esta forma no lo toma,
        //Diferente seria si no tendriamos nada mas que el where
        //Ej: const bd = await Recipe.findAll(condition)

        // NO FUNCIONA ASI, lo debemos pasar el where directamente dentro del 
        // const condition = name
        //     ? { where: { name: { [Op.iLike]: "%" + name + "%" } } }
        //     : {}


        const bdName = await Recipe.findAll({
            include: Diet,
            where: {
                name: {
                    [Op.iLike]: "%" + name + "%"
                }
            },
            order: [
                ['name', 'ASC']
            ],
        })


        const bd = await Recipe.findAll({
            include: {
                model: Diet,
                attibutes: ['name'],
                through: {
                    attibutes: [],
                }
            }
        })

        if (!name) {
            if (api || bd) {
                const apiInfo = api.data.results?.map(e => {
                    return {
                        id: e.id,
                        name: e.title,
                        summary: e.summary,
                        healthScore: e.healthScore,
                        analyzedInstructions: e.analyzedInstructions
                            .map(a => a.steps.map((b, i) => `${i + 1}. ${b.step}.`))
                            //.flat(1)
                            .join(""),
                        image: e.image,
                        diets: e.diets
                    }
                })


                const apiAndBd = bd.concat(apiInfo);
                res.send(apiAndBd);
            }
            else {
                res.status(400).json({ message: 'Error, algo salio mal!' });
            }
        }
        else { //Si recibe name por Query
            if (api || bdName) {
                const apiInfo = api.data.results?.map(e => {
                    return {
                        id: e.id,
                        name: e.title,
                        summary: e.summary,
                        healthScore: e.healthScore,
                        analyzedInstructions: e.analyzedInstructions
                            .map(a => a.steps.map(b => b.step))
                            //.flat(1)
                            .join(""),
                        image: e.image,
                        diets: e.diets
                    }
                })

                const newName = name.substr(-1) === 's' ? name.substr(0, name.length - 1) : name;
                const apiFilter = apiInfo?.filter(e => (
                    e.name.toLowerCase().includes(newName.toLowerCase())
                ));

                const apiAndBd = bdName.concat(apiFilter);

                if (apiAndBd.length > 0) res.send(apiAndBd);
                else res.status(400).json({ message: 'No existe la receta ingresada..' });

            }
            else {
                res.status(400).json({ message: 'Error, algo salio mal!' });
            }
        }

    }
    catch (e) {
        next(e);
    }
}

// const getRecipesForDiet = async (req, res, next) => {
//     const { diet } = req.params;

//     try {
//         //Traemos la info de la api
//         const api = await axios.get(` https://api.spoonacular.com/recipes/complexSearch?apiKey=${YOUR_API_KEY}&addRecipeInformation=true&number=100`);

//         //Traemos la info de la bd
//         const bd = await Recipe.findAll({
//             include: {
//                 model: Diet,
//                 attributes: ["name"],
//                 through: {
//                     attributes: [],
//                 },
//             },
//         });

//         if (diet) {
//             if (api) {
//                 const apiInfo = api.data.results?.map(e => {
//                     return {
//                         id: e.id,
//                         name: e.title,
//                         summary: e.summary,
//                         healthScore: e.healthScore,
//                         analyzedInstructions: e.analyzedInstructions
//                             .map(a => a.steps.map(b => b.step))
//                             //.flat(1)
//                             .join(""),
//                         image: e.image,
//                         diets: e.diets
//                     }
//                 })

//                 const apiAndBd = bd.concat(apiInfo);

//                 const recipeFilter = apiAndBd.filter(recipe => {
//                     let check = false;
//                     if (recipe.diets) {
//                         recipe.diets.forEach(d => {
//                             if (recipe.createdInDb) { //Si es true, fue creada en bd
//                                 if (d.name.toLowerCase().includes(diet.toLowerCase())) {
//                                     check = true;
//                                 }
//                             }
//                             else {
//                                 if (d.toLowerCase().includes(diet.toLowerCase())) {
//                                     check = true;
//                                 }
//                             }

//                         });
//                     }
//                     return check;
//                 });
//                 //return recipeFilter;


//                 recipeFilter
//                     ? res.send(recipeFilter)
//                     : res.status(400).json({ message: 'Error, no se encuentro una receta con este tipo de dieta' })
//             }
//         }
//     }
//     catch (e) {
//         next(e)
//     }
// }


//GET

const recipeById = async (req, res, next) => {
    const { id } = req.params;

    try {
        //Traemos la info de la api
        const api = await axios.get(` https://api.spoonacular.com/recipes/complexSearch?apiKey=${YOUR_API_KEY}&addRecipeInformation=true&number=100`);

        //Traemos la info de la bd

        const bd = await Recipe.findAll({
            include: {
                model: Diet,
                attributes: ["name"],
                through: {
                    attributes: [],
                },
            },
        });

        if (id) {
            if (api) {
                const apiInfo = api.data.results?.map(e => {
                    return {
                        id: e.id,
                        name: e.title,
                        summary: e.summary.replace(/<[^>]*>?/gm, ""),
                        healthScore: e.healthScore,
                        analyzedInstructions: e.analyzedInstructions
                            .map(a => a.steps.map(b => b.step))
                        //.flat(1)
                        ,
                        image: e.image,
                        diets: e.diets
                    }
                })

                const detailt = apiInfo.find(e => e.id === parseInt(id))
                    ? apiInfo.filter(e => e.id === parseInt(id))
                    : bd.filter(e => e.id == id);


                detailt.length > 0
                    ? res.send(detailt)
                    : res.status(400).json({ message: 'Error, no se encontro un detalle' });
            }
        }
    }
    catch (e) {
        next(e);
    }
}

//POST
const addInfo = async (req, res, next) => {
    // const {
    //     name,
    //     summary,
    //     healthScore,
    //     steps,
    //     image,
    //     createdInDb,
    //     diets
    // } = req.body;

    // if (!name || !summary || !healthScore || !image) return res.status(404).json({ message: "Falta enviar datos obligatorios" });
    // if (typeof healthScore === 'string') healthScore = parseInt(healthScore);
    // // if(typeof createdInDb === 'string') createdInDb = valueOf(createdInDb);
    // if (healthScore < 0 || healthScore > 100) return res.status(404).json({ message: "La puntuación de salud debe estar entre 0 y 100." });

    // try {
    //     const newRecipe = await Recipe.create({
    //         name,
    //         summary,
    //         healthScore,
    //         steps,
    //         image,
    //         createdInDb
    //     });
    //     const dietsList = await Diet.findAll({
    //         where: {
    //             id: {
    //                 [Op.in]: diets,
    //             },
    //         },
    //     })
    //     await newRecipe.addDiet(dietsList) //Se logra la relacion
    //     if (newRecipe) res.json({ message: "Creado correctamente", data: newRecipe });
    // }
    // catch (e) {
    //     next(e);
    // }

    //---------------------------------------------------------------------------------------------
    const { recipe, diets } = req.body;


    if (!recipe.name || !recipe.summary || !recipe.healthScore || !recipe.image) return res.status(404).json({ message: "Falta enviar datos obligatorios" });
    if (typeof recipe.healthScore === 'string') recipe.healthScore = parseInt(recipe.healthScore);
    if (recipe.healthScore < 0 || recipe.healthScore > 100) return res.status(404).json({ message: "La puntuación de salud debe estar entre 0 y 100." });

    try {

        const newRecipe = await Recipe.create(recipe);
        //Nosotros queremos darle la posibilidad a el usuario a que la receta que esta creando, pueda estar relacionada a muchos tipos de dietas, para esto hacemos las relaciones


        let arr = [];

        for (let i = 0; i < diets.length; i++) {
            arr[i] = await newRecipe.addDiet(diets[i]);
        }

        if (newRecipe && arr[0]) res.json({ message: "Creado correctamente", data: newRecipe });
        else res.json({ message: "Error, por alguna razon no se pudo crear la receta, fiajte mejor" });
    }
    catch (e) {
        next(e);
    }

    //---------------------------------------------------------------------------------------------

    // try {
    //     const { recipe } = req.body;
    //     let receta = await Recipe.create(recipe)

    //     //res.send(recipe.diets + 'No llega nada');

    //     recipe.diets.forEach(async (d) => {
    //         let dieta = await Diet.findAll({ where: { name: d.toLowerCase() } });
    //         //res.send(dieta);
    //         await dieta.addRecipe(receta);
    //     });


    //     let response = await Recipe.findAll({
    //         where: { name: recipe.name },
    //         include: Diet,
    //     });
    //     res.json(response);
    // }
    // catch (e) {
    //     next(e);
    // }
}


// Esta no funciona X, ordena las recetas de la api, y a lo ultimo de estas recetas
// estan las recetas de la bd ordenadas.

const orderByName = async (req, res, next) => {
    const { order } = req.params;

    try {
        const api = await axios.get(` https://api.spoonacular.com/recipes/complexSearch?apiKey=${YOUR_API_KEY}&addRecipeInformation=true&number=100`);

        if (order) {
            if (api) {
                const apiInfo = api.data.results?.map(e => {
                    return {
                        id: e.id,
                        name: e.title,
                        summary: e.summary,
                        healthScore: e.healthScore,
                        analyzedInstructions: e.analyzedInstructions
                            .map(a => a.steps.map(b => b.step))
                            //.flat(1)
                            .join(""),
                        image: e.image,
                        diets: e.diets
                    }
                })
                const bd = await Recipe.findAll({ include: Diet });

                const bdInfo = bd.map(r => {
                    return {
                        id: r.id,
                        name: r.name,
                        summary: r.summary,
                        healthScore: r.healthScore,
                        steps: r.steps.map(s => s),
                        image: r.image,
                        createdInBd: true,
                        diets: r.diets,
                    }
                })
                const apiAndBd = [...bdInfo, ...apiInfo];

                if (order === 'asc') {
                    apiAndBd.sort(function (a, b) {
                        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        return 0;
                    })
                    res.json(apiAndBd)
                }
                else if (order === 'desc') {
                    apiAndBd.sort(function (a, b) {
                        if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
                        if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
                        return 0;
                    })
                    res.json(apiAndBd)
                }
            }
        }
    }
    catch (e) {
        next(e);
    }
}




module.exports = {
    getAllInfo,
    recipeById,
    //getRecipesForDiet,
    addInfo,
    orderByName,
};