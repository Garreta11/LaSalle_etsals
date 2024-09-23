// ./schemas/about.js

export default {
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      title: 'Title',
      type: 'string',
      name: 'title',
    },
    {
      name: 'cat',
      title: 'Català',
      type: 'array',
      description: 'Descripció de la pàgina ABOUT en català.',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'es',
      title: 'Español',
      type: 'array',
      description: 'Descripción de la página ABOUT en español.',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'en',
      title: 'English',
      type: 'array',
      description: 'Description of the ABOUT page in English.',
      of: [
        {
          type: 'block',
        },
      ],
    },
  ],
}
