'use client';
import styles from './aboutWrapper.module.scss';
import { useData } from '@/app/DataContext';
import Header from '../header/header';
import { useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
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
  console.log(content);
  return (
    <div className={styles.aboutwrapper}>
      <Header fixed={true} />

      <div className={styles.aboutwrapper__subheader}>
        <p>About</p>
        <Link href='/'>
          <svg
            width='11'
            height='11'
            viewBox='0 0 11 11'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M4.79289 5.34272L1.17879 8.95682L1.8859 9.66393L5.5 6.04983L9.1141 9.66393L9.82121 8.95682L6.20711 5.34272L9.66407 1.88575L8.95697 1.17865L5.5 4.63561L2.04303 1.17865L1.33593 1.88575L4.79289 5.34272Z'
              fill='white'
            />
            <path
              d='M1.17879 8.95682L1.00201 8.78004L0.825238 8.95682L1.00201 9.1336L1.17879 8.95682ZM4.79289 5.34272L4.96967 5.5195L5.14645 5.34272L4.96967 5.16594L4.79289 5.34272ZM1.8859 9.66393L1.70912 9.8407L1.8859 10.0175L2.06268 9.8407L1.8859 9.66393ZM5.5 6.04983L5.67678 5.87305L5.5 5.69627L5.32322 5.87305L5.5 6.04983ZM9.1141 9.66393L8.93732 9.8407L9.1141 10.0175L9.29088 9.8407L9.1141 9.66393ZM9.82121 8.95682L9.99798 9.1336L10.1748 8.95682L9.99798 8.78004L9.82121 8.95682ZM6.20711 5.34272L6.03033 5.16594L5.85355 5.34272L6.03033 5.5195L6.20711 5.34272ZM9.66407 1.88575L9.84085 2.06253L10.0176 1.88575L9.84085 1.70898L9.66407 1.88575ZM8.95697 1.17865L9.13374 1.00187L8.95697 0.825093L8.78019 1.00187L8.95697 1.17865ZM5.5 4.63561L5.32322 4.81239L5.5 4.98917L5.67678 4.81239L5.5 4.63561ZM2.04303 1.17865L2.21981 1.00187L2.04303 0.825092L1.86626 1.00187L2.04303 1.17865ZM1.33593 1.88575L1.15915 1.70898L0.982374 1.88575L1.15915 2.06253L1.33593 1.88575ZM1.35557 9.1336L4.96967 5.5195L4.61612 5.16594L1.00201 8.78004L1.35557 9.1336ZM2.06268 9.48715L1.35557 8.78004L1.00201 9.1336L1.70912 9.8407L2.06268 9.48715ZM5.32322 5.87305L1.70912 9.48715L2.06268 9.8407L5.67678 6.2266L5.32322 5.87305ZM9.29088 9.48715L5.67678 5.87305L5.32322 6.2266L8.93732 9.8407L9.29088 9.48715ZM9.64443 8.78004L8.93732 9.48715L9.29088 9.8407L9.99798 9.1336L9.64443 8.78004ZM6.03033 5.5195L9.64443 9.1336L9.99798 8.78004L6.38388 5.16594L6.03033 5.5195ZM9.4873 1.70898L6.03033 5.16594L6.38388 5.5195L9.84085 2.06253L9.4873 1.70898ZM8.78019 1.35542L9.4873 2.06253L9.84085 1.70898L9.13374 1.00187L8.78019 1.35542ZM5.67678 4.81239L9.13374 1.35542L8.78019 1.00187L5.32322 4.45884L5.67678 4.81239ZM1.86626 1.35542L5.32322 4.81239L5.67678 4.45884L2.21981 1.00187L1.86626 1.35542ZM1.5127 2.06253L2.21981 1.35542L1.86626 1.00187L1.15915 1.70898L1.5127 2.06253ZM4.96967 5.16594L1.5127 1.70898L1.15915 2.06253L4.61612 5.5195L4.96967 5.16594Z'
              fill='white'
            />
          </svg>
        </Link>
      </div>

      <div className={styles.aboutwrapper__content}>
        <div className={styles.aboutwrapper__content__cat}>
          <p className={styles.aboutwrapper__content__title}>CAT</p>
          <PortableText value={content[0].cat} />
        </div>
        <div className={styles.aboutwrapper__content__es}>
          <p className={styles.aboutwrapper__content__title}>ES</p>
          <PortableText value={content[0].es} />
        </div>
        <div className={styles.aboutwrapper__content__en}>
          <p className={styles.aboutwrapper__content__title}>EN</p>
          <PortableText value={content[0].en} />
        </div>
      </div>
    </div>
  );
};

export default AboutWrapper;
