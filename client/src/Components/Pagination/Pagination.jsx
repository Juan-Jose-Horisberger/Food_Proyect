import React from "react";
import styles from './Pagination.module.css'

export default function Paginado({ recipesPerPage, allRecipes, paginado }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(allRecipes / recipesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className={`container-fluid d-flex justify-content-center align-items-center mt-2 ${styles.pagination}`}>
            <nav>
                <ul className={`row ${styles.listPagination}`}>
                    {pageNumbers?.map((number) => {
                        return (
                            <li key={number} className={`nav-link col`}>
                                <button onClick={() => paginado(number)} className={`${styles.buttonsPagination}`}>{number}</button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
