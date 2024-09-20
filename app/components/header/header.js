'use client';
import React from 'react';
import styles from './header.module.scss';
import { useData } from '@/app/DataContext';
import Link from 'next/link';

const Header = ({ fixed, handleDownloadAPP }) => {
  //Context
  const { showExperience } = useData();
  return (
    <header className={`${styles.header} ${fixed ? styles.header__fixed : ''}`}>
      <div className={styles.header__wrapper}>
        <a className={styles.header__wrapper__logo} href='/'>
          ETSALS: Learning in constellations
        </a>

        {showExperience && (
          <div className={styles.header__wrapper__links}>
            <Link
              className={styles.header__wrapper__links__about}
              href='/about'
            >
              About
            </Link>

            <p
              className={styles.header__wrapper__links__pdf}
              onClick={handleDownloadAPP}
            >
              Export pdf
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
