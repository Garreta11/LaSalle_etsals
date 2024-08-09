'use client';
import React, { useState } from 'react';
import styles from './Filters.module.scss';

const Filters = () => {
  const [filters, setFilters] = useState([]);
  return (
    <div className={styles.filters}>
      <div className={styles.filters__wrapper}>
        <p>Filters ({filters.length}) +</p>
      </div>
    </div>
  );
};

export default Filters;
