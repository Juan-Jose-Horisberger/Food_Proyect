import React from 'react';
import { Link } from 'react-router-dom';
import video from '../../Videos/video.mp4';
import styles from "./LandingPage.module.css";

export default function LandingPage() {
    return (
        <div className={styles.conteinerLandingPage}>
            <video muted autoPlay loop className={styles.LandingPageVideo}>
                <source src={video}></source>
            </video>
            <div className={styles.infoLandingPage}>
                <h1>Welcome to FOODLY</h1>
                <p>Where you will find the best recipes that fit your needs</p>
                <Link to='/home'>
                    <button type="button" className="btn btn-outline-secondary">Discover</button>
                </Link>
                <p>Developed by Juan Jose Horisberger</p>
            </div>
        </div>
    )
}