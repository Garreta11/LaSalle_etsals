'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './activeConstellations.module.scss';
import { useData } from '@/app/DataContext';

const colors = ['#C6FF6A', '#FCFF6C', '#E18DFF', '#89F8FF'];

const ActiveConstellations = () => {
  // Context
  const { activeConst, removeFromActiveConst } = useData();

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoverColor, setHoverColor] = useState('');

  const handleRemoveItem = (_item) => {
    removeFromActiveConst(_item._id);
  };

  const handleMouseEnter = (index) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setHoveredIndex(index);
    setHoverColor(randomColor);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setHoverColor('');
  };

  return (
    <div className={styles.active}>
      <div className={styles.active__wrapper}>
        <p>Active constellations ({activeConst.length})</p>
      </div>

      <div
        className={`${styles.active__list} ${
          activeConst.length > 0 ? styles.active__list__open : ''
        }`}
      >
        <div className={styles.active__list__wrapper}>
          {activeConst.map((c, i) => {
            return (
              <div
                key={i}
                className={styles.active__list__wrapper__item}
                style={{
                  backgroundColor: hoveredIndex === i ? hoverColor : 'initial',
                }}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  className={styles.active__list__wrapper__item__remove}
                  src='/close-black.svg'
                  alt='close'
                  width={12}
                  height={12}
                  onClick={() => handleRemoveItem(c)}
                />
                {c.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActiveConstellations;
