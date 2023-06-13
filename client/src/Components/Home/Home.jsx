import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import { getRecipes, getDiets, filterRecipesByType, filterRecipesCreated, orderByName, orderByHealthScore } from '../../Actions';
import Recipe from '../Recipe/Recipe';
import Pagination from '../Pagination/Pagination';
import styles from './Home.module.css';
import imgIcon from '../../Imagenes/food-restaurant.png';
// import image1 from '../../Imagenes/pexels-alesia-kozik-6546024.jpg'
// import image2 from '../../Imagenes/pexels-alesia-kozik-6546033.jpg'
// import image3 from '../../Imagenes/pexels-polina-kovaleva-5645161.jpg'
// import icon from '../../Imagenes/iconDieta.png';


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

    const [disabled, setDisabled] = useState(false);

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

    useEffect(() => {
        // window.scrollTo(0, 0);
    }, [currentPage]);

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
        if (e.target.value !== "Order by name") {
            dispatch(orderByName(e.target.value));
        }
        setCurrentPage(1);
        setOrder(`${e.target.value} order`);
    }

    function handleSortHealthScore(e) {
        e.preventDefault();
        if (e.target.value !== "Order by health score") {
            dispatch(orderByHealthScore(e.target.value));
        }
        setCurrentPage(1);
        setOrder(`${e.target.value} order`); // Modificamos el estado order, para que se vuelva a renderizar mi componente
    }

    return (
        <div className={`container-fluid mx-0 px-0`}>
            <div className={`row`}> {/* style={{border: '1px solid red'}}*/} {/*className={`row ${styles.navegation}*/}
                <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                    <div className="container-fluid">
                        <Link to='/' className="navbar-brand d-flex align-items-center">
                            <div style={{ width: "55px" }} className='d-flex'>
                                <img src={imgIcon} className='img-fluid' />
                            </div>
                            <h1 className='ps-1'>FOODLY</h1>
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse row " id="navbarSupportedContent">
                            <ul className="navbar-nav col-12 col-lg-8 d-flex justify-content-sm-start justify-content-lg-end">
                                <Link to='/About' className="nav-item mx-3 mx-lg-2" style={{ textDecoration: 'none' }}>
                                    <p className={`nav-link mb-0 text-start text-sm-center ${styles.navegation}`} aria-current="page">About</p>
                                </Link>
                                <li className="nav-item mx-3  mx-lg-2">
                                    <p className={`nav-link mb-0 text-start text-sm-center ${styles.navegation}`} onClick={(e) => { handleClick(e) }}>Reload page</p>
                                </li>
                                <Link to='/create' className="nav-item mx-3  mx-lg-2" style={{ textDecoration: 'none' }}>
                                    <p className={`nav-link mb-0 text-start text-sm-center ${styles.navegation}`}>Create recipe</p>
                                </Link>
                            </ul>
                            <SearchBar
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                </nav>

            </div>



            {
                loaded ? (
                    <div className={`${styles.filters}`}>
                        <div className={`container-fluid col-11 mb-3`}>
                            <h3 className={`${styles.filtersTitle}`}>Filters</h3>
                            <div className={`row d-flex justify-content-center`}>
                                <select onChange={(e) => handleFilterType(e)} className={`col-md-2 mx-3 mb-2 ${styles.selects}`}>
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
                                <select onChange={(e) => handleSortName(e)} className={`col-md-2 mx-3 mb-2  ${styles.selects}`}>
                                    <option>Order by name</option>
                                    <option value='asc'>A-Z</option>
                                    <option value='desc'>Z-A</option>
                                </select>
                                <select onChange={(e) => handleSortHealthScore(e)} className={`col-md-2 mx-3 mb-2  ${styles.selects}`}>
                                    <option>Order by health score</option>
                                    <option value='asc'>Min-Max</option>
                                    <option value='desc'>Max-Min</option>
                                </select>
                                <select onChange={(e) => handleFilterCreated(e)} className={`col-md-2 mx-3 mb-2  ${styles.selects}`}>
                                    <option value='all'>All</option>
                                    <option value='api'>Existing</option>
                                    <option value='created'>Created</option>
                                </select>
                            </div>
                        </div>

                        {currentRecipes.length ? ( //44:53
                            <div className='container-fluid'>
                                <div className='row d-flex justify-content-center col-12 mx-0 px-0'>
                                    {
                                        currentRecipes && currentRecipes.map(e => {
                                            return (
                                                <div key={e.id} className={`col-9 col-sm-4 col-md-4 col-lg-4 col-xl-3 mx-3 my-2 ${styles.containerRecipes}`}>
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
                            </div>
                        ) : (
                            <p>Not recipes found.</p>
                        )}

                        <Pagination
                            recipesPerPage={recipesPerPage}
                            allRecipes={allRecipes.length}
                            paginado={paginado}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                ) : (
                    <div
                        className={`d-flex justify-content-center flex-column ${styles.container_loading}`}
                    >
                        <p>Cargando...</p>
                        <div
                            className={`spinner-border ${styles.loading}`}
                            style={{ width: "4rem", height: "4rem" }}
                            role="status"
                        >
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

