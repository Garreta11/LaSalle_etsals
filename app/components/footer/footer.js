'use client';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './footer.module.scss';

import { useData } from '../../DataContext';

const Footer = () => {
  const { transformWrapperRef } = useData();
  const { scaleZoom, showExperience } = useData();
  const [selectedScale, setSelectedScale] = useState(1);

  /* const scales = [
    { label: '1:100', value: 2.0 },
    { label: '1:75', value: 1.75 },
    { label: '1:50', value: 1.5 },
    { label: '1:25', value: 1.25 },
    { label: '1:1', value: 1 },
  ]; */
  const scales = [
    { label: '1:1', value: 1.0 },
    { label: '1:0,8', value: 1.25 },
    { label: '1:0,66', value: 1.5 },
    { label: '1:0,57', value: 1.75 },
    { label: '1:0,5', value: 2.0 },
  ];

  useEffect(() => {
    if (scaleZoom) {
      const closestScale = scales.reduce((prev, curr) => {
        return Math.abs(curr.value - scaleZoom) <
          Math.abs(prev.value - scaleZoom)
          ? curr
          : prev;
      });
      setSelectedScale(closestScale.value);
    }
  }, [scaleZoom]);

  const handleScale = useCallback(
    (size) => {
      if (transformWrapperRef.current) {
        transformWrapperRef.current.setTransform(0, 0, size, 200, 'easeOut');
        setSelectedScale(size);
      }
    },
    [transformWrapperRef]
  );

  return (
    <footer
      className={`${styles.footer} ${showExperience ? '' : styles.footer__black}`}
    >
      {showExperience && (
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
      )}
      {!showExperience && (
        <div className={styles.footer__wrapper}>
          <p>This experience is only available on desktop devices</p>
        </div>
      )}
    </footer>
  );
};

export default Footer;
