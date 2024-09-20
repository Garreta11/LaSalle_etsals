'use client';
import { DataProvider } from '../DataContext';
import { getAbout } from '../utils/sanity';
import AboutWrapper from '../components/aboutWrapper/aboutWrapper';

const About = async () => {
  const about = await getAbout();
  return (
    <DataProvider>
      <AboutWrapper content={about} />
    </DataProvider>
  );
};

export default About;
