import axios from 'axios';
import { GET_RECIPES, GET_DIETS, RECIPE_BY_NAME, RECIPE_BY_ID, FILTER_BY_TYPE, FILTER_CREATED, ORDER_BY_NAME, ORDER_BY_HEALTH_SCORE } from './actionTypes';

export function getRecipes() {
    return async function (dispatch) {
        let recipes = await axios.get("http://localhost:3001/recipes");
        return dispatch({
            type: GET_RECIPES,
            payload: recipes.data,
        });
    };
}

export function getRecipesByName(recipe) {
    return async function (dispatch) {
        try {
            let recipesByName = await axios.get(`http://localhost:3001/recipes?name=${recipe}`);
            console.log(recipesByName.data);
            return dispatch({
                type: RECIPE_BY_NAME,
                payload: recipesByName.data
            })
        }
        catch (e) {
            return dispatch({ type: RECIPE_BY_NAME, payload: [] })
        }

    }
}


export function getDiets() {
    return async function (dispatch) {
        let diets = await axios.get("http://localhost:3001/diets");
        return dispatch({
            type: GET_DIETS,
            payload: diets.data,
        });
    };
}

export function postRecipes(data) {
    return async function (dispatch) {
        console.log(data);
        let newRecipe = await axios.post(`http://localhost:3001/recipes/create`, data);
        return newRecipe;
    }
}

export function getRecipeDetail(id) {
    return async function (dispatch) {
        let recipeDetail = await axios.get(`http://localhost:3001/recipes/${id}`);
        return dispatch({
            type: RECIPE_BY_ID,
            payload: recipeDetail.data
        })
    }
}

// <---FILTERS AND ORDER--->
export function filterRecipesByType(payload) {
    return {
        type: FILTER_BY_TYPE,
        payload
    }
}

export function filterRecipesCreated(payload) {
    return {
        type: FILTER_CREATED,
        payload
    }
}

export function orderByName(order) {
    console.log(order);
    return async function (dispatch) {
        let recipesOrder = await axios.get(`http://localhost:3001/recipes/name/${order}`);
        return dispatch({
            type: ORDER_BY_NAME,
            payload: recipesOrder.data
        })
    }
}

export function orderByHealthScore(payload) {
    return {
        type: ORDER_BY_HEALTH_SCORE,
        payload
    }
}