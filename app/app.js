'use client';
import React from 'react';
import { DataProvider } from './DataContext';

import Header from './components/header/header';
import Footer from './components/footer/footer';
import Canvas from './components/canvas/canvas';
import ActiveConstellations from './components/activeConstellations/activeConstellations';
import Filters from './components/filters/filters';

const App = ({ constellations, axes, external }) => {
  return (
    <DataProvider>
      <Header />
      <ActiveConstellations />
      <Filters />
      <Canvas constellations={constellations} axes={axes} external={external} />
      <Footer />
    </DataProvider>
  );
};

export default App;
