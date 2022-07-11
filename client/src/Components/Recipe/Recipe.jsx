import React from 'react';
import { Link } from 'react-router-dom';

export default function Recipe({ image, name, diets, id, createdInBd }) {

    return (
        <div>
            <img src={image} alt="" />
            <h3>{name}</h3>
            {/* <h3>{diets}</h3> */}
            <div>
                {diets?.map((d,i) => {
                    return (
                        <div key={i}>
                            {createdInBd ? d.name.toUpperCase() : d.toUpperCase()}
                        </div>
                    );
                })}
            </div>

            <Link to={`/RecipeDetail/${id}`}>
                <button>Mode info {id}</button>
            </Link>
        </div>
    )
}