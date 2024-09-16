// DataContext.js
import React, { createContext, useContext, useState, useRef } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const transformWrapperRef = useRef(null);
  const [activeConst, setActiveConst] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [scaleZoom, setScaleZoom] = useState(1);

  // Function to update activeConst by adding a new item
  const addToActiveConst = (newItem) => {
    setActiveConst((prevActiveConst) => {
      // Check if an item with the same id already exists
      const itemExists = prevActiveConst.some(
        (item) => item._id === newItem._id
      );
      if (itemExists) {
        return prevActiveConst; // Do not add the item if it exists
      }
      // Add the item if it does not exist
      return [...prevActiveConst, newItem];
    });
  };

  // Function to remove a specific item from the activeConst array
  const removeFromActiveConst = (idToRemove) => {
    setActiveConst((prevActiveConst) =>
      prevActiveConst.filter((item) => item._id !== idToRemove)
    );
  };

  const addToActiveFilters = (newItem) => {
    setActiveFilters((prevActiveFilters) => {
      // Check if an item with the same id already exists
      const itemExists = prevActiveFilters.some((item) => item === newItem);
      if (itemExists) {
        return prevActiveFilters; // Do not add the item if it exists
      }
      // Add the item if it does not exist
      return [...prevActiveFilters, newItem];
    });
  };

  // Function to remove a specific item from the activeFilters array
  const removeFromActiveFilters = (idToRemove) => {
    setActiveFilters((prevActiveFilters) =>
      prevActiveFilters.filter((item) => item !== idToRemove)
    );
  };

  const editScaleZoom = (zoom) => {
    setScaleZoom(zoom);
  };

  return (
    <DataContext.Provider
      value={{
        transformWrapperRef,
        activeConst,
        addToActiveConst,
        removeFromActiveConst,
        activeFilters,
        addToActiveFilters,
        removeFromActiveFilters,
        scaleZoom,
        editScaleZoom,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to consume DataContext
export const useData = () => useContext(DataContext);
