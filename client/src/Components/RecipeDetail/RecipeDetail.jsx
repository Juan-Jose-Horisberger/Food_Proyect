import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getRecipeDetail } from '../../Actions';
import styles from './RecipeDetail.module.css'


export default function RecipeDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const recipeDetail = useSelector(state => state.recipeDetail);
    const [loaded, setLoaded] = useState(false);

    useEffect(async () => {
        await dispatch(getRecipeDetail(id))
        setLoaded(true);
    }, [dispatch])

    return (
        <div className='container d-flex justify-content-center'>
            {console.log(recipeDetail)}
            {loaded ? (
                <div className='row col-9 bg-light my-5'>
                    <div className='row p-4 d-flex flex-column-reverse align-items-center flex-sm-row'>
                        <div className={`col-10 col-sm-10 d-flex justify-content-center justify-content-sm-start pr-5`}>
                            <h1 className={`${styles.titleDetail} fs-md-4`}>{recipeDetail[0].name}</h1>
                        </div>
                        <div className='col-2 col-md-2 d-flex justify-content-center align-items-center align-self-end align-self-sm-start pb-2'>
                            <Link to='/home'>
                                <button className={`btn btn-outline-success`}>Home</button>
                            </Link>
                        </div>
                    </div>
                    <div className='row p-0 m-0 mb-4 d-flex justify-content-center flex-column flex-lg-row'>
                        <div className=' col-lg-5 me-4 mb-md-4 mb-lg-0 text-start d-flex justify-content-center'>
                            <img className='img-fluid' src={recipeDetail[0].image} alt="Image" />
                        </div>
                        <div className=' col-lg-4 bg-secondary mt-4 m-md-0'>
                            <p className={`text-start fs-5 pt-2 ${styles.titleDetail2}`}>Health Score: {recipeDetail[0].healthScore}</p>
                            <h3 className={`text-start ${styles.titleDetail2}`}>Diets:</h3>
                            <ul className={`navbar-nav ${styles.textJustify}`}>
                                {/* {console.log(recipeDetail)} */}
                                {
                                    recipeDetail[0].dietsApi !== null //
                                        ?
                                        recipeDetail[0].dietsApi.map((d, i) =>
                                            <li key={i} className={`col-12 m-0 p-0 text-capitalize text-justify`}>
                                                {`${i + 1}. ${d}`}
                                            </li>
                                        )
                                        : recipeDetail[0].diets.map((d, i) =>
                                            <li key={i} className={`col-12 m-0 p-0 text-capitalize text-justify`}>
                                                {`${i + 1}. ${d.name}`}
                                            </li>
                                        )
                                }
                            </ul>
                        </div>
                    </div>
                    <div className='bg-secondary'>
                        <h3 className='text-start ps-3'>Description</h3>
                        {/* <p className={`${styles.textJustify}`}>{recipeDetail[0].summary}</p> */}
                    </div>
                    <div className='mt-3'>
                        <h3 className='text-start ps-3'>Steps</h3>
                        <ul className={`${styles.textJustify}`}>
                            {
                                recipeDetail[0].analyzedInstructions.length
                                    ? recipeDetail[0].analyzedInstructions?.map((s, i) =>
                                        <li key={i}>{s}</li>
                                        )
                                    : <li>There are no steps in this recipe...</li>
                            }
                        </ul>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}