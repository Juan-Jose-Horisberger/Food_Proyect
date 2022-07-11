import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import { getRecipes, getDiets, filterRecipesByType, filterRecipesCreated, orderByName, orderByHealthScore } from '../../Actions';
import Recipe from '../Recipe/Recipe';
import Pagination from '../Pagination/Pagination';
import styles from './Home.module.css';

export default function Home() {
    const dispatch = useDispatch();
    const allRecipes = useSelector(state => state.recipes);
    const allDiets = useSelector(state => state.diets);

    //Order
    const [order, setOrder] = useState("");
    const [recipeOrigin, setRecipeOrigin] = useState("all"); // esto para QUE (???)

    //Pagination

    //El estado locar currentPage hacemos referencia a nuestra pagina actual, decimos que tendra como valor 1 porque siempre empieza en la primer pagina.
    const [currentPage, setCurrentPage] = useState(1);

    //En el estado recipesPerPage, almacename cuantas recetas quiero por pagina
    const [recipesPerPage, setRecipesPerPage] = useState(9);

    const indexOfLastRecipe = currentPage * recipesPerPage; //1 * 9 = 9

    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage; // 9 - 9 = 0 

    //currentRecipes tendra las recetas de la pagina actual
    const currentRecipes = allRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    const [loaded, setLoaded] = useState(false);

    const paginado = (pageNumber) => { //Nos va a ayudar a renderizar
        setCurrentPage(pageNumber);
    }

    function getData() {
        if (allRecipes.length > 0 && allDiets.length > 0) {
            setLoaded(true);
            return;
        }
        Promise.all([dispatch(getRecipes()), dispatch(getDiets())])
            .then(res => res && setLoaded(true))
            .catch(err => console.log(err))

        // await dispatch(getRecipes())
        // await dispatch(getDiets())
        // setLoaded(true);
    }

    useEffect(() => {
        getData()
    }, [])

    function handleClick(e) {
        e.preventDefault();
        dispatch(getRecipes());
        dispatch(getDiets());
    }

    function handleFilterType(e) {
        e.preventDefault();
        dispatch(filterRecipesByType(e.target.value));
        setCurrentPage(1);
    }

    function handleFilterCreated(e) {
        e.preventDefault();
        setRecipeOrigin(e.target.value);
        dispatch(filterRecipesCreated(e.target.value));
        setCurrentPage(1);
    }

    function handleSortName(e) {
        e.preventDefault();
        dispatch(orderByName(e.target.value));
        setCurrentPage(1);
        setOrder(`${e.target.value} order`);
    }

    function handleSortHealthScore(e) {
        e.preventDefault();
        dispatch(orderByHealthScore(e.target.value));
        setCurrentPage(1);
        setOrder(`${e.target.value} order`); // Modificamos el estado order, para que se vuelva a renderizar mi componente
    }

    return (
        <div>
            <div className={styles.navegation}>
                <div>
                    <Link to='/'>
                        <h1>FOODLY</h1>
                    </Link>
                </div>
                <div>
                    <div>
                        <Link to='/About'>
                            <button>About</button>
                        </Link>
                    </div>
                    <div>
                        <button onClick={(e) => { handleClick(e) }}>Reload page</button>
                    </div>
                    <div>
                        <Link to='/create'>
                            <button>Create recipe</button>
                        </Link>
                    </div>
                    <SearchBar />
                </div>
            </div>

            {
                loaded ? (
                    <div>
                        <div>
                            <h3>Filters</h3>
                            <div>
                                <select onChange={(e) => handleFilterType(e)}>
                                    <option value="All">All</option>
                                    {
                                        allDiets.map((type) => {
                                            return (
                                                <option value={type.name} key={type.id}>
                                                    {type.name}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                                <select onChange={(e) => handleSortName(e)}>
                                    <option>Order by name</option>
                                    <option value='asc'>A-Z</option>
                                    <option value='desc'>Z-A</option>
                                </select>
                                <select onChange={(e) => handleSortHealthScore(e)}>
                                    <option>Order by health score</option>
                                    <option value='asc'>Min-Max</option>
                                    <option value='desc'>Max-Min</option>
                                </select>
                                <select onChange={(e) => handleFilterCreated(e)}>
                                    <option value='all'>All</option>
                                    <option value='api'>Existing</option>
                                    <option value='created'>Created</option>
                                </select>
                            </div>
                        </div>
                        <Pagination
                            recipesPerPage={recipesPerPage}
                            allRecipes={allRecipes.length}
                            paginado={paginado}
                        />
                        {currentRecipes.length ? ( //44:53
                            <div>
                                {
                                    currentRecipes && currentRecipes.map(e => {
                                        return (
                                            <div key={e.id}>
                                                <Recipe
                                                    id={e.id}
                                                    name={e.name}
                                                    image={e.image}
                                                    diets={e.diets}
                                                    createdInBd={e.createdInBd} />
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        ) : (
                            <p>Not recipes found.</p>
                        )}
                    </div>
                ) : (
                    <p>Loading...</p>
                )
            }
        </div>
    )
}

