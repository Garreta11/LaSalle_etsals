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
      name: 'firstParagraph',
      title: 'First Paragraph',
      type: 'text',
      description: 'Text for the first paragraph of the About page.',
    },
    {
      name: 'secondParagraph',
      title: 'Second Paragraph',
      type: 'text',
      description: 'Text for the second paragraph of the About page.',
    },
    {
      name: 'thirdParagraph',
      title: 'Third Paragraph',
      type: 'text',
      description: 'Text for the third paragraph of the About page.',
    },
    {
      name: 'fourthParagraph',
      title: 'Fourth Paragraph',
      type: 'text',
      description: 'Text for the fourth paragraph of the About page.',
    },
  ],
}
