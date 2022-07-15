import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Recipe.module.css'

export default function Recipe({ image, name, diets, id, createdInBd }) {

    return (
        <div className={`py-2 px-0 ${styles.recipeContainer}`}>
            <img src={image} alt="" className={`img-fluid`} />
            <h3 className={`my-2 ${styles.nameRecipe}`}>{name}</h3>
            {/* <div className='my-3'> Quitamos esto ya que visualmente no queda bien
                    <div className='col-12'>
                        <h4 className='pb-0 mb-0 text-decoration-underline'>Diets</h4>
                    </div>
                    <div className='col-6 my-3'>
                        {diets?.map((d, i) => {
                            return (
                                <div key={i}>
                                    <p className={`p-0 m-0`}>
                                        {createdInBd ? `${i + 1}. ${d.name.toUpperCase()}` : `${i + 1}. ${d.toUpperCase()}`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div> */}
            <Link to={`/RecipeDetail/${id}`}>
                <button className={`btn btn-outline-success`}>More information</button>
            </Link>
        </div>
    )
}