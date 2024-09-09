// DataContext.js
import React, { createContext, useContext, useState, useRef } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const transformWrapperRef = useRef(null);
  const [activeConst, setActiveConst] = useState([]);

  // Function to update activeConst by adding a new item
  const addToActiveConst = (newItem) => {
    setActiveConst((prevActiveConst) => {
      // Check if an item with the same id already exists
      const itemExists = prevActiveConst.some((item) => item.id === newItem.id);
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
      prevActiveConst.filter((item) => item.id !== idToRemove)
    );
  };

  return (
    <DataContext.Provider
      value={{
        transformWrapperRef,
        activeConst,
        addToActiveConst,
        removeFromActiveConst,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to consume DataContext
export const useData = () => useContext(DataContext);
