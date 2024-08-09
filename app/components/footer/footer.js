'use client';
import React from 'react';
import styles from './footer.module.scss';

const Footer = () => {
  const handleScale = (e, size) => {
    console.log(e, size);
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__wrapper}>
        <p>Scale</p>
        <div className={styles.footer__wrapper__values}>
          <p
            className={`${styles.footer__wrapper__values__item} scale scale__selected`}
            onClick={(e) => handleScale(e, 0)}
          >
            1:100
          </p>
          <p
            className={`${styles.footer__wrapper__values__item} scale`}
            onClick={(e) => handleScale(e, 0.25)}
          >
            1:75
          </p>
          <p
            className={`${styles.footer__wrapper__values__item} scale`}
            onClick={(e) => handleScale(e, 0.5)}
          >
            1:50
          </p>
          <p
            className={`${styles.footer__wrapper__values__item} scale`}
            onClick={(e) => handleScale(e, 0.75)}
          >
            1:25
          </p>
          <p
            className={`${styles.footer__wrapper__values__item} scale`}
            onClick={(e) => handleScale(e, 1)}
          >
            1:1
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
