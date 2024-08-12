import {buildLegacyTheme, defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const props = {
  '--my-white': '#fff',
  '--my-black': '#1a1a1a',
  '--my-blue': '#89F8FF',
  '--my-red': '#EC7357',
  '--my-yellow': '#FCFF6C',
  '--my-green': '#C6FF6A',
  '--my-purple': '#E18DFF',
}

export const myTheme = buildLegacyTheme({
  /* Base theme colors */
  '--black': props['--my-black'],
  '--white': props['--my-white'],

  '--gray': '#666',
  '--gray-base': '#666',

  '--component-bg': props['--my-white'],
  '--component-text-color': props['--my-black'],

  /* Brand */
  '--brand-primary': props['--my-blue'],

  // Default button
  // '--default-button-color': '#666',
  '--default-button-color': props['--my-blue'],
  '--default-button-primary-color': props['--my-purple'],
  '--default-button-success-color': props['--my-green'],
  '--default-button-warning-color': props['--my-yellow'],
  '--default-button-danger-color': props['--my-red'],

  /* State */
  '--state-info-color': props['--my-blue'],
  '--state-success-color': props['--my-green'],
  '--state-warning-color': props['--my-yellow'],
  '--state-danger-color': props['--my-red'],

  /* Navbar */
  '--main-navigation-color': props['--my-red'],
  '--main-navigation-color--inverted': props['--my-white'],

  '--focus-color': props['--my-green'],
})

export default defineConfig({
  name: 'default',
  title: 'ETSALS',

  projectId: 'wu8boxdv',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  theme: myTheme,
})
