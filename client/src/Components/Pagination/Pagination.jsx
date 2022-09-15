import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SearchBar from "../SearchBar/SearchBar";
import styles from './Pagination.module.css'

export default function Paginado({ recipesPerPage, allRecipes, currentPage, setCurrentPage }) {
    const pageNumbers = [];
    const booleano = useSelector(state => state.boolean);

    const [input, setInput] = useState(1);
    // const [modifyInput, setModifyInput] = useState(false);

    for (let i = 1; i <= Math.ceil(allRecipes / recipesPerPage); i++) {
        pageNumbers.push(i);
    }

    function previousAndNext(e) {
        e.preventDefault();
        e.target.id === "previous"
            ? currentPage > 1 && (setCurrentPage(currentPage - 1) === undefined && setInput(input - 1))
            : currentPage < pageNumbers.length && (setCurrentPage(currentPage + 1) === undefined && setInput(input + 1))
    }

    useEffect(() => {
        setInput(1);
    }, [booleano])

    return (
        <div>
            <nav>
                <ul className={styles.containerUl}>
                    <img
                        id="previous"
                        className={`${styles.buttonPrevious}`} //${disabledPrevious && styles.open}
                        onClick={(e) => previousAndNext(e)}
                        src="https://img.icons8.com/ios-glyphs/50/000000/circled-chevron-left.png"
                        alt="Imagen previous"

                    />

                    <input name="page" autoComplete="off" value={input} disabled />
                    <p>de {pageNumbers.length}</p>


                    <img
                        id="next"
                        className={styles.buttonNext}
                        onClick={previousAndNext}
                        src="https://img.icons8.com/ios-glyphs/50/000000/circled-chevron-right.png"
                        alt="Imagen next"
                    />
                </ul>
            </nav>
        </div>

    );
}
