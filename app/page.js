import Image from 'next/image';
import styles from './page.module.scss';

import App from './app';
import { getConstellations, getAxes } from './utils/sanity';

const Home = async () => {
  const constellations = await getConstellations();
  const axes = await getAxes();
  return <App constellations={constellations} axes={axes} />;
};

export default Home;
