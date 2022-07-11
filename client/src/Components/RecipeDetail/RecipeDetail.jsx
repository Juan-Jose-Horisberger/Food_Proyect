import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getRecipeDetail } from '../../Actions';


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
        <div>
            {loaded ? (
                <div>
                    {console.log(recipeDetail)}
                    <div>
                        <div>
                            <h1>{recipeDetail[0].name}</h1>
                        </div>
                        <div>
                            <Link to='/home'>
                                <button>Home</button>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div>
                            <img src={recipeDetail[0].image} alt="Image" />
                        </div>
                        <div>

                            <p>Health Score: {recipeDetail[0].healthScore}</p>

                            <ul>
                                {recipeDetail[0].diets?.map((d, i) =>
                                    <li key={i}>
                                        {recipeDetail[0].createdInBd ? d.name : d}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3>Description</h3>
                        <p>{recipeDetail[0].summary}</p>
                    </div>
                    <div>
                        <h3>Steps</h3>
                        <ul>
                            {
                                recipeDetail[0].createdInBd 
                                    ?   recipeDetail[0].steps?.map((s,i) =>
                                            <li key={i}>{i + 1}. {s}</li>
                                        )
                                    :   recipeDetail[0].analyzedInstructions[0]?.map((s,i) => 
                                            <li key={i}>{i + 1}. {s}</li>
                                        )
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