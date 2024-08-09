'use client';
import React from 'react';
import styles from './header.module.scss';

const Header = () => {
  const handleDownload = () => {
    console.log('Download SVG');
  };
  return (
    <header className={styles.header}>
      <div className={styles.header__wrapper}>
        <a className={styles.header__wrapper__logo} href='/'>
          ETSALS: Learning in constellations
        </a>

        <div className={styles.header__wrapper__links}>
          <a className={styles.header__wrapper__links__about} href='/'>
            About
          </a>
          <p
            className={styles.header__wrapper__links__pdf}
            onClick={handleDownload}
          >
            Export pdf
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
