import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { getDiets, getRecipes, postRecipes } from '../../Actions';
import styles from "./Form.module.css";

let regExpUrl = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/i; //URL image
// --> /i verifica si se cumple la regular expression

export default function CreateRecipe() {
    const history = useHistory();
    const dispatch = useDispatch();
    const allDiets = useSelector(state => state.diets);

    const [input, setInput] = useState({
        name: "",
        summary: "",
        healthScore: 0,
        steps: "",
        image: "",
        diets: []
    })
    const [inputImage, setInputImage] = useState({ image: "" });

    //Estados locales
    const [stepsList, setStepsList] = useState([]); // Estado local de pasos
    let [stepCounter, setStepCounter] = useState(0); //Contador de cada paso
    const [error, setError] = useState({}) //Estado maneja errores
    const [errorImage, setErrorImage] = useState({}) // Estado maneja errores de la imagen
    const [image, setImage] = useState([]);
    const [errorsExist, setErrorsExist] = useState(true); //Valida si existe algun error en mi form, si no existe es false y muestra el button

    const [showImage, setShowImage] = useState(false); // Si es true, quiere decir que no hay errores en la url de la IMG, por lo cual se muestra en pantalla dicha img

    const [imageButton, setImageButton] = useState(true); //Valida si existe error en la img, si no existe muestra el button de add.

    const [showField, setShowField] = useState(false); //Estado maneja campo de input (img).

    const [buttonStep, setButtonStep] = useState(true);
    // <------ FUNCIONES QUE SE EJECUTAN CUANDO SE MODIFICA UN INPUT O CUANDO SE HACE UN CLICK EN EL ------>
    function handleChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })

        const objError = validate({ ...input, [e.target.name]: e.target.value });

        setError(objError);
        if (Object.entries(objError).length === 0) { //Lo utilizamos para saber si existe un error (nos sirve para habilitar el submit)
            setErrorsExist(false);
        }

        if(e.target.name === 'steps'){
            if(e.target.value === ''){
                setButtonStep(true)
            }
            else {
                setButtonStep(false)
            }
        }
    }

    //https://i.pinimg.com/originals/bb/8e/37/bb8e374bedc0d7212ed80d31798d9c14.gif

    function handleChangeImage(e) {
        setInputImage({
            ...inputImage,
            image: e.target.value
        })

        const objError = validateImage({ ...inputImage, image: e.target.value });
        setErrorImage(objError);


        //<---- activate IMAGE ----->
        if (Object.entries(objError).length === 0) setImageButton(false);
        else setImageButton(true);
    }

    function handleCheck(e) {
        if (e.target.checked) {
            setInput({
                ...input,
                diets: [...input.diets, parseInt(e.target.value)]
            })

            // De esta forma creo que tambien se podria.
            //console.log([...new Set([...input.diets, e.target.value])]);

            const objError = validate({ ...input, [input.diets]: e.target.value })
            setError(objError)
        }
        else { //Si no esta checkeada la filtramos, esto es para cuando saca el check
            setInput({
                ...input,
                diets: input.diets.filter((el) => el !== parseInt(e.target.value)),
            });
        }

    }

    function addImage(e) {
        e.preventDefault();

        const oneImage = image.map(i => i); // Image = array de objs

        if (image.length === 1) {
            alert("Please do not enter a new image, one already exists.")
            setInputImage({
                ...inputImage,
                image: ""
            })
        }
        if (inputImage.image && image.length === 0) {
            setImage([
                ...image,
                { url: inputImage.image },
            ]);
            setShowField(true);
            setImageButton(true);
            setInputImage({
                ...inputImage,
                image: ""
            })
        }

        if (!errorImage.image) setShowImage(true);
    }

    function deleteImg(e) {
        e.preventDefault(e);
        setImage([]);
        setShowField(false);
        setImageButton(true);
        setShowImage(false);
    }



    function addStep() {
        const allDescriptions = stepsList.map(step => step.description);
        // console.log(allDescriptions)
        const findStep = allDescriptions.filter(description => description === input.steps); //Si hay un paso igual, a otro 

        //paso ya existente en allDescriptions filtramelo en findStep

        if (findStep.length) {
            alert("Please, do not repeat the step.") //Intentar que esto salga como un error
            setInput({
                ...input,
                steps: ""
            })
        }
        if (input.steps && !findStep.length) {
            setStepCounter(++stepCounter);
            setStepsList([
                ...stepsList,
                { number: stepCounter, description: input.steps },
            ]);
            setInput({
                ...input,
                steps: "",
            });
        }
        stepCounter >= 1 && setErrorsExist(false)
    }

    function deleteStep(e, stepNumberToDelete) {
        e.preventDefault();
        let filteredSteps = stepsList.filter(   // [paso1, paso2, paso4, paso5, paso6] = 5        [paso3] = 3
            //    1      2       3      4      5
            (el) => el.number !== stepNumberToDelete //steps  6 -------------- stepNumberToDelete = 3 - 1 = 3
        );//                                                                                                i

        //Este for nos sirve para que se re acomoden los numeros de los steps al ser eliminado alguno
        for (let i = stepNumberToDelete - 1; i < filteredSteps.length; i++) {
            if (filteredSteps[i]) {
                filteredSteps[i].number = filteredSteps[i].number - 1;
            }
        }
        setStepCounter(--stepCounter);
        setStepsList(filteredSteps);
        stepCounter === 0 && setErrorsExist(true)
    }

    //  <-------------- VALIDACIONES --------------> 

    // /^[a-zA-Z][ ]$/ = Caracteres de A-Z ya sea en mayuscula o minuscula
    // /[ ]/ = Espera un espacio
    // (?=^.{5,100}$) = Como minimo 5 caracteres, y max 100
    // /(?=^.{5,100}$)^[A-Z ]+$/i = completo

    function validate(input) {
        let error = {};

        // <------- Validations NAME ------->

        if (!input.name) {
            error.name = "Title is required.";
        }
        else if (!/(?=^.{5,100}$)/i.test(input.name)) { //Min 5 max 100
            error.name = "Title needs 5 characters or more";
            if (!/^[A-Z ]+$/i.test(input.name)) {
                error.name = 'No numbers, symbols or special characters are accepted';
            }
        }
        else if (!/^[A-Z ]+$/i.test(input.name)) { //No acepta Simbolos
            error.name = 'No numbers, symbols or special characters are accepted';
        }

        // <------- Validations DESCRIPTION ------->

        if (!input.summary) {
            error.summary = "Summary is required.";
        }
        else if (!/(?=^.{5,254}$)/i.test(input.summary)) { //Min 5 max 100
            error.summary = "summary needs 5 characters or more";
            if (!/^[A-Z ]+$/i.test(input.summary)) {
                error.summary = 'No numbers, symbols or special characters are accepted';
            }
        }
        else if (!/^[A-Z ]+$/i.test(input.summary)) { //No acepta Simbolos
            error.summary = 'No numbers, symbols or special characters are accepted';
        }


        // <------- Validations HEALTHSCORE - DIETS - STEPS ------->

        if (input.healthScore === 0) {
            error.healthScore = "Health score is required.";
        }
        if (input.diets.length === 0) {

            error.diets = "At least 1 diet is required";
        }
        if (stepsList.length === 0) {
            //console.log(stepsList.length);
            error.steps = "At least 1 step is required.";
        }


        return error;
    }

    function validateImage(inputImage) {
        let errorImage = {};
        //trim() elimina los espacios laterales    
        if (!regExpUrl.test(inputImage.image.trim())) {
            errorImage.image = 'The entered URL must be one of the type: (jpg, jpeg, gif or png)';
            // setShowImage(false);
        }
        return errorImage;
    }


    // <-------------- ENVIAMOS FORMULARIO -------------->
    function handleSubmit(e) {
        e.preventDefault();
        if (
            input.name &&
            input.summary &&
            input.diets.length &&
            input.healthScore &&
            stepsList.length &&
            Object.keys(error).length === 1 && Object.keys(error).join('') === 'steps' //Unico error que aceptamos, ya que lo controlamos de otra forma.
        ) {
            input.image = image.map(e => e.url).join('');

            if (!input.image) {
                input.image =
                    "https://assets.unileversolutions.com/recipes-v2/109064.jpg";
            }

            let stepsArray = stepsList.map((el, i) => `${el.description}`); //Solo tomamos la description
            input.steps = stepsArray; //Y modificamos steps

            const recipe = { //Formato
                recipe: {
                    name: input.name,
                    summary: input.summary,
                    healthScore: parseInt(input.healthScore),
                    steps: input.steps,
                    image: input.image,
                    createdInBd: true
                },
                diets: input.diets
            }

            //console.log(recipe)


            Promise.all([
                dispatch(postRecipes(recipe)),
                dispatch(getRecipes()),
                dispatch(getDiets())
            ])
                .then(alert("Recipe created."))
                .catch(err => console.log(err));

            setInput({
                name: "",
                summary: "",
                healthScore: 1,
                image: "",
                steps: "",
                diets: [],
            });

            history.push('/home');

        }
    }


    // <-------------- CUANDO SE MONTA MI COMPONENT -------------->
    useEffect(() => {
        if (allDiets.length > 0) {
            return;
        }
        dispatch(getDiets())
    })

    return (
        <div>
            <div>
                <h1>Create you recipe!</h1>
                <Link to='/home'>
                    <button>Home</button>
                </Link>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <div>
                        <label>Title</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={input.name}
                            placeholder='Title...'
                            autoComplete='off'
                            className={error.name && styles.inputError}
                            onChange={handleChange}
                        />
                        {
                            error.name && <p className={styles.danger}>{error.name}</p>
                        }
                    </div>
                    <div>
                        <label>Description</label>
                        <input
                            type="text"
                            name="summary"
                            defaultValue={input.summary}
                            maxLength="254"
                            placeholder='Description...'
                            autoComplete='off'
                            className={error.summary && styles.inputError}
                            onChange={handleChange}
                        />
                        {
                            error.summary && <p className={styles.danger}>{error.summary}</p>
                        }
                    </div>
                </div>
                <div>
                    <div>
                        <label>Health Score</label>
                        <div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                defaultValue={input.healthScore}
                                name="healthScore"
                                onChange={handleChange}
                            />
                            <p className={styles}>
                                {input.healthScore}
                            </p>
                            {
                                error.healthScore && <p className={styles.danger}>{error.healthScore}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>Image (optional)</label>
                        <input
                            type="text"
                            value={inputImage.image}
                            name="image"
                            autoComplete='off'
                            onChange={(e) => handleChangeImage(e)}
                            disabled={showField}
                            placeholder="image URL"
                            maxLength="254"
                        />
                        <button onClick={(e) => addImage(e)} disabled={imageButton}>Add</button>
                        <button onClick={(e) => deleteImg(e)} disabled={!image.length ? true : false} >X</button>
                    </div>
                    {
                        errorImage.image && <p className={styles.danger}>{errorImage.image}</p>
                    }
                    {showImage && (<img src={image?.map(e => e.url)} alt="Image not found." />)}
                    <div>
                        <label>Diets</label>
                        <div>
                            {/* {console.log(input.diets)} */}
                            {allDiets.map((d) => (
                                <div key={d.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            //name={d.name}
                                            //value={d.name}
                                            value={d.id}
                                            onClick={(e) => handleCheck(e)}
                                        />
                                        {d.name.toUpperCase()}
                                    </label>
                                </div>
                            ))}
                            {
                                input.diets.length === 0 && <p className={styles.danger}>{error.diets}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>Steps</label>
                        <div>
                            <p>Create new step</p>
                            <input
                                type="text"
                                value={input.steps} //Para limpiar el input es necesario que este el value
                                //defaultValue={input.steps}
                                autoComplete='off'
                                name="steps"
                                maxLength="254"
                                placeholder='Add steps...'
                                className={(error.steps && stepCounter === 0) ? styles.inputError : null} // : null, es porque tira un warning si no lo esta.
                                onChange={(e) => handleChange(e)}
                            />
                            <button type='button' onClick={() => addStep()} disabled={buttonStep}>Add</button>
                            <div>
                                <div>
                                    {stepsList?.map((el) => (
                                        <p key={el.number}>
                                            <span>{el.number}. </span>
                                            {el.description}
                                            <button onClick={(e) => deleteStep(e, el.number)}>
                                                X
                                            </button>
                                        </p>
                                    ))}
                                </div>
                                {
                                    stepsList.length === 0 && <p className={styles.danger}>{error.steps}</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* {console.log(stepsList)} */}
                <button type="submit" disabled={errorsExist}>
                    Submit
                </button>
            </form>
            <br />
            <br />
            <br />
        </div>
    )
}