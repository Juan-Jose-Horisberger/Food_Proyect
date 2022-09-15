import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';
import gitHub from '../../Imagenes/github.svg';
import linkedin from '../../Imagenes/linkedin.svg';
import email from '../../Imagenes/email-svgrepo-com.svg';

export default function About() {
    return (
        <div className={styles.containerAll}>
            <div className={styles.container}>
                <div className={styles.containerAboutMe}>
                    <h1>About me</h1>
                    <div>
                        <Link to='/home'>
                            <button>Home</button>
                        </Link>
                    </div>
                    <p>My name is Juan José Horisberger, I am from Buenos Aires, Argentina. Today I am on the way to becoming a Full-Stack web developer. I decided to be part of SoyHenry, an intensive bootcamp that has more than 700 hours of study where I learned technologies such as JavaScript, ReactJs, Redux, React-Redux, NodeJs, Express, PostgreSQL, Sequelize among others.</p>
                </div>
                <div className={styles.containerInfoProyect}>
                    <h2>Information about the project</h2>
                    <p>The purpose of this individual project is to make known the knowledge acquired during the Bootcamp. The main idea of ​​the project was to make a SPA (Single Page Application) with the theme "Recipes" where it was necessary to bring the information from an external API ("spoonacular API") and then store it in its own database.</p>
                </div>
                <div className={styles.containerContactInfo}>
                    <h3>Contact information</h3>
                    <ul>
                        <li>
                            <a href="mailto:juanjhorisberger@gmail.com?Subject=Propuesta%20laboral">
                                <img src={email} alt="" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/juan-jose-horisberger/">
                                <img src={linkedin} alt="" />
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/Juan-Jose-Horisberger">
                                <img src={gitHub} alt="" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}