import React from "react";
//import styles from './Pagination.module.css'

export default function Paginado({ recipesPerPage, allRecipes, paginado }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(allRecipes / recipesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div >
            <nav>
                <ul>
                    {pageNumbers?.map((number) => {
                        return (
                            <li key={number}>
                                <button onClick={() => paginado(number)}>{number}</button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
