//importaciones de tipos de acciones a concretar
import { GET_RECIPES, GET_DIETS, RECIPE_BY_NAME, RECIPE_BY_ID, FILTER_BY_TYPE, FILTER_CREATED, ORDER_BY_NAME, ORDER_BY_HEALTH_SCORE, POST_RECIPE } from '../Actions/actionTypes';

const initialState = {
    recipes: [],
    diets: [],
    allRecipes: [],
    recipeDetail: [],
};


//Al hacer Destructuring, podemos lograr esto switch (type) en ves de switch (action.type), 
//Lo mismo con el payload.

const rootReducer = (state = initialState, { type, payload }) => { //51:40
    switch (type) {
        case GET_RECIPES:
            return {
                ...state,
                recipes: payload,
                allRecipes: payload, //Hacemos una copia del estado recipes, donde siempre tendremos todas las recipes
            }
        case GET_DIETS:
            return {
                ...state,
                diets: payload
            }
        case FILTER_BY_TYPE: //Filtrado por tipo de dieta desde el front
            const allRecipes = state.allRecipes;  //Almacenamos las recetas en una constante

            const recipesFiltered = payload === 'All'
                ? allRecipes
                : allRecipes.filter((recipe) => {
                    let check = false;
                    if (recipe.diets) {
                        recipe.diets.forEach((el) => {
                            if (recipe.createdInBd) {
                                if (el.name.toLowerCase().includes(payload.toLowerCase())) {
                                    check = true;
                                }
                            } else {
                                if (el.toLowerCase().includes(payload.toLowerCase())) {
                                    check = true;
                                }
                            }

                        });
                    }
                    return check;
                });
            return {
                ...state,
                recipes: recipesFiltered, //Lo que filtramos, queremos cambiar el estado global recipes
            }
        case FILTER_CREATED:
            const allRecipesCopied = state.allRecipes;
            const createdFilter = payload === 'created'
                ? allRecipesCopied.filter(r => r.createdInBd)
                : allRecipesCopied.filter(r => !r.createdInBd)
            return { //1:05:43
                ...state,
                recipes: payload === 'all'
                    ? state.allRecipes
                    : createdFilter
            }
        case ORDER_BY_NAME:
            return {
                ...state,
                recipes: payload
            }
        case ORDER_BY_HEALTH_SCORE:
            const sortedArrHealthScore = payload === 'asc'
                ? state.recipes.sort(function (a, b) {
                    if (a.healthScore > b.healthScore) return 1;
                    if (a.healthScore < b.healthScore) return -1;
                    return 0;
                })
                : state.recipes.sort(function (a, b) {
                    if (a.healthScore > b.healthScore) return -1;
                    if (a.healthScore < b.healthScore) return 1;
                    return 0;
                })
            return {
                ...state,
                recipes: sortedArrHealthScore
            }

        case RECIPE_BY_NAME:
            return {
                ...state,
                recipes: payload
            }
        case RECIPE_BY_ID:
            return {
                ...state,
                recipeDetail: payload
            }
        case POST_RECIPE:
            return {
                ...state,
            };
        default:
            return { ...state }
    }
}

export default rootReducer;