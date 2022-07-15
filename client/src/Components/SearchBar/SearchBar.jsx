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
        <div className='col'>
            <form onSubmit={(e) => handleSubmit(e)} className="d-flex">
                <input
                    type="text"
                    value={name}
                    placeholder='Search...'
                    onChange={(e) => handleInputChange(e)}
                    className="form-control me-2"
                />
                <button className="btn btn-outline-success" type='submit'>Search</button>
            </form>
        </div>
    )
}