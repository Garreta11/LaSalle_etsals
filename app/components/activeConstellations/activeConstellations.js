'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './activeConstellations.module.scss';
import { useData } from '@/app/DataContext';

const ActiveConstellations = () => {
  //Context
  const { activeConst, removeFromActiveConst } = useData();

  const handleRemoveItem = (_item) => {
    removeFromActiveConst(_item.id);
  };

  return (
    <div className={styles.active}>
      <div className={styles.active__wrapper}>
        <p>Active constellations ({activeConst.length})</p>
      </div>
      {activeConst.length > 0 && (
        <div className={styles.active__list}>
          <div className={styles.active__list__wrapper}>
            {activeConst.map((c, i) => {
              console.log(c);
              return (
                <div key={i} className={styles.active__list__wrapper__item}>
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
      )}
    </div>
  );
};

export default ActiveConstellations;
