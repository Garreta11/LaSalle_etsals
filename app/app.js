'use client';
import React, { useRef } from 'react';
import { DataProvider } from './DataContext';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Header from './components/header/header';
import Footer from './components/footer/footer';
import Canvas from './components/canvas/canvas';
import ActiveConstellations from './components/activeConstellations/activeConstellations';
import Filters from './components/filters/filters';

const App = ({ constellations, axes, external }) => {
  const screenRef = useRef();

  const handleDownload = () => {
    const input = screenRef.current;

    setTimeout(() => {
      html2canvas(input, { useCORS: true }).then((canvas) => {
        try {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({ orientation: 'landscape' });
          pdf.addImage(
            imgData,
            'PNG',
            0,
            0,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight()
          );
          pdf.save('download.pdf');
        } catch (error) {
          console.error('Error generating data URL:', error);
        }
      });
    }, 100); // Adjust the delay as needed
  };

  return (
    <DataProvider>
      <Header handleDownloadAPP={handleDownload} />
      <ActiveConstellations />
      <Filters constellations={constellations} axes={axes} />
      <Canvas
        ref={screenRef}
        constellations={constellations}
        axes={axes}
        external={external}
      />
      <Footer />
    </DataProvider>
  );
};

export default App;
