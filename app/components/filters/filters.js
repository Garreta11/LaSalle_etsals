'use client';
import React, { useState } from 'react';
import styles from './filters.module.scss';

const colors = ['#C6FF6A', '#FCFF6C', '#E18DFF', '#89F8FF'];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Filters = ({ constellations, axes }) => {
  const [filters, setFilters] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [clickedItems, setClickedItems] = useState({});

  const toggleFilters = () => {
    setOpenFilters((prevState) => !prevState);
  };

  const handleMouseEnter = (id) => {
    setHoveredItemId(id);
  };

  const handleMouseLeave = () => {
    setHoveredItemId(null);
  };

  const handleClick = (id, text) => {
    if (filters.includes(id)) {
      // Remove the item from the filters array and reset its background color
      setFilters((prev) => prev.filter((item) => item !== id));
      setClickedItems((prev) => {
        const updatedClickedItems = { ...prev };
        delete updatedClickedItems[id];
        return updatedClickedItems;
      });
    } else {
      // Add the item to the filters array and set its background color
      setFilters((prev) => [...prev, id]);
      setClickedItems((prev) => ({ ...prev, [id]: getRandomColor() }));
    }
    setOpenFilters(false);
  };

  const getItemStyle = (id) => {
    if (clickedItems[id]) {
      return { backgroundColor: clickedItems[id] };
    }
    if (hoveredItemId === id) {
      return { backgroundColor: getRandomColor() };
    }
    return {};
  };

  // Function to check if the item is clicked
  const isItemClicked = (id) => filters.includes(id);

  return (
    <div className={styles.filters}>
      <div className={styles.filters__wrapper} onClick={toggleFilters}>
        <p>
          Filters ({filters.length}){' '}
          <span
            className={`${styles.filters__wrapper__sign} ${
              openFilters ? styles.filters__wrapper__sign__close : ''
            }`}
          >
            +
          </span>
        </p>
      </div>

      <div
        className={`${styles.filters__list} ${
          openFilters ? styles.filters__list__open : ''
        }`}
      >
        <div className={styles.filters__list__wrapper}>
          <p className={styles.filters__list__wrapper__title}>
            School attributes:
          </p>
          <div className={styles.filters__list__wrapper__items}>
            {constellations[0].children.map((c, i) => (
              <p
                key={`school-${i}`}
                className={styles.filters__list__wrapper__items__item}
                onMouseEnter={() => handleMouseEnter(`school-${i}`)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(`school-${i}`, c.title)}
                style={getItemStyle(`school-${i}`)}
              >
                <span
                  className={`${styles.filters__list__wrapper__items__item__sign} ${
                    isItemClicked(`school-${i}`)
                      ? styles.filters__list__wrapper__items__item__sign__close
                      : ''
                  }`}
                >
                  +
                </span>{' '}
                {c.title}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.filters__list__wrapper}>
          <p className={styles.filters__list__wrapper__title}>
            Knowledge axes:
          </p>
          <div className={styles.filters__list__wrapper__items}>
            {axes[0].children.map((c, i) => (
              <p
                key={`axis-${i}`}
                className={styles.filters__list__wrapper__items__item}
                onMouseEnter={() => handleMouseEnter(`axis-${i}`)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(`axis-${i}`, c.title)}
                style={getItemStyle(`axis-${i}`)}
              >
                <span
                  className={`${styles.filters__list__wrapper__items__item__sign} ${
                    isItemClicked(`axis-${i}`)
                      ? styles.filters__list__wrapper__items__item__sign__close
                      : ''
                  }`}
                >
                  +
                </span>{' '}
                {c.title}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.filters__list__wrapper}>
          <p className={styles.filters__list__wrapper__title}>
            Training cycles:
          </p>
          <div className={styles.filters__list__wrapper__items}>
            {['1st cycle', '2nd cycle', 'Master', 'Research'].map((item, i) => (
              <p
                key={`cycle-${i}`}
                className={styles.filters__list__wrapper__items__item}
                onMouseEnter={() => handleMouseEnter(`cycle-${i}`)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(`cycle-${i}`, item)}
                style={getItemStyle(`cycle-${i}`)}
              >
                <span
                  className={`${styles.filters__list__wrapper__items__item__sign} ${
                    isItemClicked(`cycle-${i}`)
                      ? styles.filters__list__wrapper__items__item__sign__close
                      : ''
                  }`}
                >
                  +
                </span>{' '}
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
