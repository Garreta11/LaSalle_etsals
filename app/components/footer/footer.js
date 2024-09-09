'use client';
import React, { useCallback, useState } from 'react';
import styles from './footer.module.scss';

import { useData } from '../../DataContext';

const Footer = () => {
  const transformWrapperRef = useData();
  const [selectedScale, setSelectedScale] = useState(1);

  const handleScale = useCallback(
    (size) => {
      if (transformWrapperRef.current) {
        transformWrapperRef.current.setTransform(0, 0, size, 200, 'easeOut');
      }
      setSelectedScale(size);
    },
    [transformWrapperRef]
  );

  const scales = [
    { label: '1:100', value: 2.0 },
    { label: '1:75', value: 1.75 },
    { label: '1:50', value: 1.5 },
    { label: '1:25', value: 1.25 },
    { label: '1:1', value: 1 },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__wrapper}>
        <p>Scale</p>
        <div className={styles.footer__wrapper__values}>
          {scales.map(({ label, value }) => (
            <p
              key={value}
              className={`${styles.footer__wrapper__values__item} ${selectedScale === value ? 'selected' : ''}`}
              onClick={() => handleScale(value)}
            >
              {label}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
