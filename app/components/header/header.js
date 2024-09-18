'use client';
import React from 'react';
import styles from './header.module.scss';
import { useData } from '@/app/DataContext';

const Header = ({ handleDownloadAPP }) => {
  //Context
  const { showExperience } = useData();
  return (
    <header className={styles.header}>
      <div className={styles.header__wrapper}>
        <a className={styles.header__wrapper__logo} href='/'>
          ETSALS
          {showExperience && <span>: Learning in constellations</span>}
        </a>

        <div className={styles.header__wrapper__links}>
          <a className={styles.header__wrapper__links__about} href='/'>
            About
          </a>
          {showExperience && (
            <p
              className={styles.header__wrapper__links__pdf}
              onClick={handleDownloadAPP}
            >
              Export pdf
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
