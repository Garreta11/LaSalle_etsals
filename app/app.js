'use client';

import { DataProvider } from './DataContext';

import Wrapper from './components/wrapper/Wrapper';

const App = ({ constellations, axes, external, about }) => {
  return (
    <DataProvider>
      <Wrapper
        constellations={constellations}
        axes={axes}
        external={external}
        about={about}
      />
    </DataProvider>
  );
};

export default App;
