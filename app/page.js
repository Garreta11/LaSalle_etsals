import Image from 'next/image';
import styles from './page.module.scss';

import App from './app';
import {
  getConstellations,
  getAxes,
  getExternalConnections,
} from './utils/sanity';

const Home = async () => {
  const constellations = await getConstellations();
  const axes = await getAxes();
  const external = await getExternalConnections();
  return (
    <App constellations={constellations} axes={axes} external={external} />
  );
};

export default Home;
