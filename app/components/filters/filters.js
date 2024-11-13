'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './filters.module.scss';
import { useData } from '@/app/DataContext';

const colors = ['#C6FF6A', '#FCFF6C', '#E18DFF', '#89F8FF'];

const categories = [
  {
    title: '1st cycle',
    name: 'firstCycle',
  },
  {
    title: '2nd cycle',
    name: 'secondCycle',
  },
  {
    title: 'Master',
    name: 'master',
  },
  {
    title: 'Research',
    name: 'research',
  },
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Filters = ({ constellations, axes }) => {
  const {
    activeFilters,
    addToActiveFilters,
    removeFromActiveFilters,
    showExperience,
  } = useData();
  const [openFilters, setOpenFilters] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [clickedItems, setClickedItems] = useState({});

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoverColor, setHoverColor] = useState('');

  const toggleFilters = () => {
    setOpenFilters((prevState) => !prevState);
  };

  const handleMouseEnter = (id) => {
    setHoveredItemId(id);
  };

  const handleMouseLeave = () => {
    setHoveredItemId(null);
  };

  const handleClick = (id) => {
    const isFilterActive = activeFilters.some((filter) => filter === id);

    if (isFilterActive) {
      // Remove the item from the filters array and reset its background color
      removeFromActiveFilters(id);
      setClickedItems((prev) => {
        const updatedClickedItems = { ...prev };
        delete updatedClickedItems[id];
        return updatedClickedItems;
      });
    } else {
      // Add the item to the filters array and set its background color
      addToActiveFilters(id);
      setClickedItems((prev) => ({ ...prev, [id]: getRandomColor() }));
    }
    // setOpenFilters(false);
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
  const isItemClicked = (id) => activeFilters.includes(id);

  const handleMouseEnterActive = (index) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setHoveredIndex(index);
    setHoverColor(randomColor);
  };

  const handleRemoveItemActive = (_item) => {
    removeFromActiveFilters(_item);
  };

  return (
    <div className={styles.filters}>
      {showExperience && (
        <>
          <div className={styles.filters__wrapper} onClick={toggleFilters}>
            <p>
              Filters ({activeFilters.length}){' '}
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
                    onMouseEnter={() => handleMouseEnter(c._id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(c._id)}
                    style={getItemStyle(c._id)}
                  >
                    <span
                      className={`${styles.filters__list__wrapper__items__item__sign} ${
                        isItemClicked(c._id)
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
                    onMouseEnter={() => handleMouseEnter(c._id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(c._id)}
                    style={getItemStyle(c._id)}
                  >
                    <span
                      className={`${styles.filters__list__wrapper__items__item__sign} ${
                        isItemClicked(c._id)
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
                {categories.map((item, i) => (
                  <p
                    key={`cycle-${i}`}
                    className={styles.filters__list__wrapper__items__item}
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(item.name)}
                    style={getItemStyle(item.name)}
                  >
                    <span
                      className={`${styles.filters__list__wrapper__items__item__sign} ${
                        isItemClicked(item.name)
                          ? styles.filters__list__wrapper__items__item__sign__close
                          : ''
                      }`}
                    >
                      +
                    </span>{' '}
                    {item.title}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* <div
            className={`${styles.filters__activelist} ${
              activeFilters.length > 0 ? styles.filters__activelist__open : ''
            }`}
          >
            <div className={styles.filters__activelist__wrapper}>
              {activeFilters.map((c, i) => {
                console.log(c);
                return (
                  <div
                    key={i}
                    className={styles.filters__activelist__wrapper__item}
                    style={{
                      backgroundColor:
                        hoveredIndex === i ? hoverColor : 'initial',
                    }}
                    onMouseEnter={() => handleMouseEnterActive(i)}
                    onMouseLeave={handleMouseEnterActive}
                  >
                    <Image
                      className={styles.filters__activelist__wrapper__remove}
                      src='/close-black.svg'
                      alt='close'
                      width={12}
                      height={12}
                      onClick={() => handleRemoveItemActive(c)}
                    />
                    {c}
                  </div>
                );
              })}
            </div>
          </div> */}
        </>
      )}
    </div>
  );
};

export default Filters;
