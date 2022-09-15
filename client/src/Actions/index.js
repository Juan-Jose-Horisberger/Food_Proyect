import axios from 'axios';
import {
    GET_RECIPES,
    GET_DIETS,
    RECIPE_BY_NAME,
    RECIPE_BY_ID,
    FILTER_BY_TYPE,
    FILTER_CREATED,
    ORDER_BY_NAME,
    ORDER_BY_HEALTH_SCORE,
    SET_TO_TRUE
} from './actionTypes';

// ~~~~~~~~~~~~~~~~~GETS~~~~~~~~~~~~~~~~~
export function getRecipes() {
    return async function (dispatch) {
        let recipes = await axios.get("/recipes");
        return dispatch({
            type: GET_RECIPES,
            payload: recipes.data,
        });
    };
}

export function getRecipesByName(recipe) {
    return async function (dispatch) {
        try {
            let recipesByName = await axios.get(`/recipes?name=${recipe}`);
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
        let diets = await axios.get("/diets");
        return dispatch({
            type: GET_DIETS,
            payload: diets.data,
        });
    };
}

export function getRecipeDetail(id) {
    return async function (dispatch) {
        let recipeDetail = await axios.get(`/recipes/${id}`);
        return dispatch({
            type: RECIPE_BY_ID,
            payload: recipeDetail.data
        })
    }
}

// ~~~~~~~~~~~~~~~~~POST~~~~~~~~~~~~~~~~~
export function postRecipes(data) {
    return async function (dispatch) {
        let newRecipe = await axios.post(`/recipes/create`, data);
        return newRecipe;
    }
}

// ~~~~~~~~~~~~~~~~~FILTERS~~~~~~~~~~~~~~~~~
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

// ~~~~~~~~~~~~~~~~~ORDERS~~~~~~~~~~~~~~~~~

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

export function setToTrue() {
    return {
        type: SET_TO_TRUE
    }
}