import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getDiets, getRecipes, postRecipes } from "../../Actions";
import styles from "./Form.module.css";
import imageFondo from "../../Imagenes/pexels-ella-olsson-1640773.jpg";

let regExpUrl = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/i; //URL image
// --> /i verifica si se cumple la regular expression

export default function CreateRecipe() {
  const history = useHistory();
  const dispatch = useDispatch();
  const allDiets = useSelector((state) => state.diets);

  const [input, setInput] = useState({
    name: "",
    summary: "",
    healthScore: 0,
    analyzedInstructions: "",
    image: "",
    dietsApi: [],
  });
  const [inputImage, setInputImage] = useState({ image: "" });

  //Estados locales
  const [stepsList, setStepsList] = useState([]); // Estado local de pasos
  let [stepCounter, setStepCounter] = useState(0); //Contador de cada paso
  const [error, setError] = useState({}); //Estado maneja errores
  const [errorImage, setErrorImage] = useState({}); // Estado maneja errores de la imagen
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
      [e.target.name]: e.target.value,
    });

    const objError = validate({ ...input, [e.target.name]: e.target.value });

    setError(objError);
    if (Object.entries(objError).length === 0) {
      //Lo utilizamos para saber si existe un error (nos sirve para habilitar el submit)
      setErrorsExist(false);
    }

    if (e.target.name === "analyzedInstructions") {
      if (e.target.value === "") {
        setButtonStep(true);
      } else {
        setButtonStep(false);
      }
    }
  }

  //https://i.pinimg.com/originals/bb/8e/37/bb8e374bedc0d7212ed80d31798d9c14.gif

  function handleChangeImage(e) {
    setInputImage({
      ...inputImage,
      image: e.target.value,
    });

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
        dietsApi: [...input.dietsApi, parseInt(e.target.value)],
      });

      // De esta forma creo que tambien se podria.
      //console.log([...new Set([...input.dietsApi, e.target.value])]);

      const objError = validate({ ...input, [input.dietsApi]: e.target.value });
      setError(objError);
    } else {
      //Si no esta checkeada la filtramos, esto es para cuando saca el check
      setInput({
        ...input,
        dietsApi: input.dietsApi.filter(
          (el) => el !== parseInt(e.target.value)
        ),
      });
    }
  }

  function addImage(e) {
    e.preventDefault();

    const oneImage = image.map((i) => i); // Image = array de objs

    if (image.length === 1) {
      alert("Please do not enter a new image, one already exists.");
      setInputImage({
        ...inputImage,
        image: "",
      });
    }
    if (inputImage.image && image.length === 0) {
      setImage([...image, { url: inputImage.image }]);
      setShowField(true);
      setImageButton(true);
      setInputImage({
        ...inputImage,
        image: "",
      });
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
    const allDescriptions = stepsList.map((step) => step.description);
    // console.log(allDescriptions)
    const findStep = allDescriptions.filter(
      (description) => description === input.analyzedInstructions
    ); //Si hay un paso igual, a otro

    //paso ya existente en allDescriptions filtramelo en findStep

    if (findStep.length) {
      alert("Please, do not repeat the step."); //Intentar que esto salga como un error
      setInput({
        ...input,
        analyzedInstructions: "",
      });
    }
    if (input.analyzedInstructions && !findStep.length) {
      setStepCounter(++stepCounter);
      setStepsList([
        ...stepsList,
        { number: stepCounter, description: input.analyzedInstructions },
      ]);
      setInput({
        ...input,
        analyzedInstructions: "",
      });
    }
    stepCounter >= 1 && setErrorsExist(false);
  }

  function deleteStep(e, stepNumberToDelete) {
    e.preventDefault();
    let filteredSteps = stepsList.filter(
      // [paso1, paso2, paso4, paso5, paso6] = 5        [paso3] = 3
      //    1      2       3      4      5
      (el) => el.number !== stepNumberToDelete //steps  6 -------------- stepNumberToDelete = 3 - 1 = 3
    ); //                                                                                                i

    //Este for nos sirve para que se re acomoden los numeros de los steps al ser eliminado alguno
    for (let i = stepNumberToDelete - 1; i < filteredSteps.length; i++) {
      if (filteredSteps[i]) {
        filteredSteps[i].number = filteredSteps[i].number - 1;
      }
    }
    setStepCounter(--stepCounter);
    setStepsList(filteredSteps);
    stepCounter === 0 && setErrorsExist(true);
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
    } else if (!/(?=^.{5,100}$)/i.test(input.name)) {
      //Min 5 max 100
      error.name = "Title needs 5 characters or more";
      if (!/^[A-Z ]+$/i.test(input.name)) {
        error.name = "No numbers, symbols or special characters are accepted";
      }
    } else if (!/^[A-Z ]+$/i.test(input.name)) {
      //No acepta Simbolos
      error.name = "No numbers, symbols or special characters are accepted";
    }

    // <------- Validations DESCRIPTION ------->

    if (!input.summary) {
      error.summary = "Summary is required.";
    } else if (!/(?=^.{5,254}$)/i.test(input.summary)) {
      //Min 5 max 100
      error.summary = "summary needs 5 characters or more";
      if (!/^[A-Z ]+$/i.test(input.summary)) {
        error.summary =
          "No numbers, symbols or special characters are accepted";
      }
    } else if (!/^[A-Z ]+$/i.test(input.summary)) {
      //No acepta Simbolos
      error.summary = "No numbers, symbols or special characters are accepted";
    }

    // <------- Validations HEALTHSCORE - DIETS - STEPS ------->

    if (input.healthScore === 0) {
      error.healthScore = "Health score is required.";
    }
    if (input.dietsApi.length === 0) {
      error.dietsApi = "At least 1 diet is required";
    }
    if (stepsList.length === 0) {
      //console.log(stepsList.length);
      error.analyzedInstructions = "At least 1 step is required.";
    }

    return error;
  }

  function validateImage(inputImage) {
    let errorImage = {};
    //trim() elimina los espacios laterales
    if (!regExpUrl.test(inputImage.image.trim())) {
      errorImage.image =
        "The entered URL must be one of the type: (jpg, jpeg, gif or png)";
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
      input.dietsApi.length &&
      input.healthScore &&
      stepsList.length &&
      Object.keys(error).length === 1 &&
      Object.keys(error).join("") === "analyzedInstructions" //Unico error que aceptamos, ya que lo controlamos de otra forma.
    ) {
      input.image = image.map((e) => e.url).join("");

      if (!input.image) {
        input.image =
          "https://assets.unileversolutions.com/recipes-v2/109064.jpg";
      }

      let stepsArray = stepsList.map((el, i) => `${el.description}`); //Solo tomamos la description
      input.analyzedInstructions = stepsArray; //Y modificamos steps

      const recipe = {
        //Formato
        recipe: {
          name: input.name,
          summary: input.summary,
          healthScore: parseInt(input.healthScore),
          analyzedInstructions: input.analyzedInstructions,
          image: input.image,
          createdInBd: true,
        },
        dietsApi: input.dietsApi,
      };

      //console.log(recipe)
      dispatch(postRecipes(recipe))
        .then(res => res && dispatch(getDiets()))
        .then(res => res && dispatch(getRecipes()))
        .then(alert("Recipe created."))
        .then(res => res && history.push('/home'))
        .catch(err => console.log(err));
    }
  }

  // <-------------- CUANDO SE MONTA MI COMPONENT -------------->
  useEffect(() => {
    if (allDiets.length > 0) {
      return;
    }
    dispatch(getDiets());
  });

  return (
    <div
      className={`d-flex justify-content-center ${styles.containerRecipeCreate}`}
    >
      <img src={imageFondo} alt="" className={`${styles.imageRecipe}`} />
      <div
        className={`container col-8 my-5 py-3 py-md-5 ${styles.containerForm}`}
      >
        <div className="row col-12 m-0 mb-4 d-flex justify-content-center flex-sm-row">
          <div className="col-12 col-sm-6">
            <h1>Create you recipe!</h1>
          </div>
          <div className="col-12 col-sm-6 d-flex justify-content-center">
            <Link to="/home" className={`d-flex align-items-center nav-link`}>
              <button className={`btn btn-success px-3`}>Home</button>
            </Link>
          </div>
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className={`col-12`}>
          <div className="container-fluid d-flex flex-column">
            <div className="col-12">
              <div className="mb-4">
                <label
                  className={`form-label d-flex ps-1 fs-5 ${styles.typography}`}
                >
                  Title
                </label>
                <div>
                  {" "}
                  {/*Div para manejar el tamaño de el input mediante col-*/}
                  <input
                    type="text"
                    name="name"
                    defaultValue={input.name}
                    placeholder="Title..."
                    autoComplete="off"
                    className={`form-control ${styles.typography} ${error.name && styles.inputError
                      }`}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {error.name && <p className={styles.danger}>{error.name}</p>}
            </div>
            <div className="col-12">
              <div className="mb-4">
                <label
                  className={`form-label d-flex ps-1 fs-5 ${styles.typography}`}
                >
                  Description
                </label>
                <div>
                  <input
                    type="text"
                    name="summary"
                    defaultValue={input.summary}
                    maxLength="254"
                    placeholder="Description..."
                    autoComplete="off"
                    className={`form-control ${styles.typography} ${error.summary && styles.inputError
                      }`}
                    onChange={handleChange}
                  />
                </div>
                {error.summary && (
                  <p className={styles.danger}>{error.summary}</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="container-fluid mb-4">
              <div className="col-12">
                <label
                  className={`form-label d-flex ps-1 fs-5 ${styles.typography}`}
                >
                  Health Score
                </label>
                <div className="col-12 m-0 d-flex flex-row">
                  <div
                    className={`col-10 col-sm-6 d-flex align-items-center px-2 p-2 ${styles.containerRanger}`}
                  >
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue={input.healthScore}
                      name="healthScore"
                      onChange={handleChange}
                      className={`form-range`}
                    />
                  </div>
                  <div
                    className={`col-1 col-sm-6 d-flex align-items-center ms-2`}
                  >
                    <p className={`fs-5 p-0 m-0 ${styles.typography}`}>
                      {input.healthScore}
                    </p>
                  </div>
                </div>
                {error.healthScore && (
                  <p className={styles.danger}>{error.healthScore}</p>
                )}
              </div>
            </div>
            <div className="container-fluid">
              <div className="col-12 mb-4">
                <label
                  className={`form-label d-flex ps-1 fs-5 ${styles.typography}`}
                >
                  Image (optional)
                </label>
                <div className="d-flex flex-column flex-sm-row">
                  <div className={`col-12 col-sm-6 me-2`}>
                    <input
                      type="text"
                      value={inputImage.image}
                      name="image"
                      autoComplete="off"
                      onChange={(e) => handleChangeImage(e)}
                      disabled={showField}
                      placeholder="image URL"
                      maxLength="254"
                      className={`form-control ${styles.typography}`}
                    />
                  </div>
                  <div className="col-12 col-sm-5 pt-1 pt-sm-0 d-flex justify-content-evenly justify-content-sm-start">
                    <button
                      className={`btn btn-success mx-sm-2 ${styles.buttonsImage}`}
                      type="button"
                      onClick={(e) => addImage(e)}
                      disabled={imageButton}
                    >
                      Add
                    </button>
                    <button
                      className={`btn btn-danger ${styles.buttonsImage}`}
                      type="button"
                      onClick={(e) => deleteImg(e)}
                      disabled={!image.length ? true : false}
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
              {errorImage.image && (
                <p className={styles.danger}>{errorImage.image}</p>
              )}
              {showImage && (
                <div className={`d-flex mx-auto ${styles.containerImage}`}>
                  <img
                    src={image?.map((e) => e.url)}
                    alt="Image not found."
                    className="img-fluid"
                  />
                </div>
              )}
            </div>
            <div className="container-fluid mb-3">
              <label
                className={`form-label d-flex justify-content-center ps-1 fs-4 mb-3 ${styles.typography}`}
              >
                Diets
              </label>
              <div className="col-12 d-flex justify-content-center">
                <div
                  className={`row col-12 col-md-10 p-1 ${styles.backgroundDiet}`}
                >
                  {/* {console.log(input.dietsApi)} */}
                  {allDiets.map((d) => (
                    <div
                      key={d.id}
                      className={`col-12 col-lg-6 d-flex mt-3 ${styles.textJustify}`}
                    >
                      <label>
                        <input
                          type="checkbox"
                          //name={d.name}
                          //value={d.name}
                          className={`form-check-input me-2 fs-4 ${styles.typography}`}
                          value={d.id}
                          onClick={(e) => handleCheck(e)}
                        />
                        {`${d.name.toUpperCase()}`}
                      </label>
                    </div>
                  ))}
                  {input.dietsApi.length === 0 && (
                    <p className={styles.danger}>{error.dietsApi}</p>
                  )}
                </div>
              </div>
            </div>
            <div className={`container-fluid`}>
              <label
                className={`form-label d-flex justify-content-center ps-1 fs-4 mb-3 ${styles.typography}`}
              >
                Steps
              </label>
              <div
                className={`col-12 p-4 d-flex flex-column flex-md-row ${styles.backgroudSteps}`}
              >
                <div className="col-12 col-md-3 d-flex flex-column justify-content-start mb-2">
                  <p
                    className={`d-flex col-8 col-md-12 fs-5 ${styles.typography} ${styles.display}`}
                  >
                    Create new step
                  </p>
                  <div className="col-12 d-flex flex-md-column">
                    <div className="col-7 me-1 m-md-0">
                      <input
                        type="text"
                        value={input.analyzedInstructions} //Para limpiar el input es necesario que este el value
                        //defaultValue={input.steps}
                        autoComplete="off"
                        name="analyzedInstructions"
                        maxLength="254"
                        placeholder="Add steps..."
                        className={`form-control ${error.analyzedInstructions && stepCounter === 0
                          ? styles.inputError
                          : null
                          }`} // : null, es porque tira un warning si no lo esta.
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div>
                      <div className="col-12 d-flex mt-md-2 p-0 m-0 ">
                        <button
                          type="button"
                          onClick={() => addStep()}
                          className={`btn btn-success`}
                          disabled={buttonStep}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-3 ps-sm-5 col d-flex ${styles.backgroudNewSteps}`}
                >
                  <div>
                    {stepsList?.map((el) => (
                      <p key={el.number} className={`${styles.typography}`}>
                        <span className="fs-5">{el.number}. </span>
                        <span className="me-2">{el.description}</span>
                        <button
                          onClick={(e) => deleteStep(e, el.number)}
                          className={`btn btn-danger p-2 py-0 ${styles.closeButton}`}
                        >
                          X
                        </button>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              {stepsList.length === 0 && (
                <p className={styles.danger}>{error.analyzedInstructions}</p>
              )}
            </div>
          </div>
          {/* {console.log(stepsList)} */}
          <button
            type="submit"
            disabled={errorsExist}
            className={`btn btn-primary mt-3`}
          >
            Submit
          </button>
        </form>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}
