'use client';
import styles from './aboutWrapper.module.scss';
import { useData } from '@/app/DataContext';
import Header from '../header/header';
import { useEffect } from 'react';
const AboutWrapper = ({ content }) => {
  const { editShowExperience } = useData();
  useEffect(() => {
    editShowExperience(false);
  }, [editShowExperience]);
  // Set the body and html to overflow scroll when the component mounts
  useEffect(() => {
    document.documentElement.style.overflowY = 'scroll';

    // Cleanup: Reset overflow style when the component unmounts
    return () => {
      document.documentElement.style.overflowY = 'auto';
    };
  }, []);
  return (
    <div className={styles.aboutwrapper}>
      <Header fixed={true} />

      <div className={styles.aboutwrapper__subheader}>
        <p>About</p>
      </div>

      <div className={styles.aboutwrapper__content}>
        <p
          className={`${styles.aboutwrapper__content__big} ${styles.aboutwrapper__content__first}`}
        >
          {content[0].firstParagraph}
        </p>
        <p
          className={`${styles.aboutwrapper__content__big} ${styles.aboutwrapper__content__second}`}
        >
          {content[0].secondParagraph}
        </p>
        <div className={styles.aboutwrapper__content__columns}>
          <p className={`${styles.aboutwrapper__content__third}`}>
            {content[0].thirdParagraph}
          </p>
          <p className={`${styles.aboutwrapper__content__fourth}`}>
            {content[0].fourthParagraph}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutWrapper;
