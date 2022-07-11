// require('dotenv').config();
// const { YOUR_API_KEY } = process.env;
// const { Op } = require('sequelize');
// const axios = require('axios');
// const { Diet } = require('../db.js'); //Models
// const { Router, json } = require('express');
// const router = Router();
// router.use(json());


// const getAllDietsTypes = async (req, res, next) => { //0:36
//     try{
//         Diet.findAll().then(r => res.json(r))
//     }
//     catch(e){
//         next(e);
//     }
// }
// module.exports = { getAllDietsTypes }

const { Diet } = require('../db.js'); //Models

module.exports = {
    getDiets: async (req, res, next) => {
        try{
            Diet.findAll().then(r => res.json(r))
        }
        catch(e){
            next(e);
        }
    }
}