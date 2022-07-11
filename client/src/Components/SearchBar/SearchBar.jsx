import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getRecipesByName } from '../../Actions';

export default function SearchBar() {

    const dispatch = useDispatch();

    const [name, setName] = useState("");

    function handleInputChange(e){
        setName(e.target.value);
    }

    function handleSubmit(e){
        e.preventDefault(e);
        dispatch(getRecipesByName(name));
        setName('');
    }

    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="text"
                    value={name}
                    placeholder='Search...'
                    onChange={(e) => handleInputChange(e)}
                />
                <button type='submit'>Search</button>
            </form>
        </div>
    )
}