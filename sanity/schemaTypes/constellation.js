import {StarFilledIcon} from '@sanity/icons'

export default {
  name: 'constellation',
  type: 'document',
  title: 'Attributes',
  icon: StarFilledIcon,
  fields: [
    {
      title: 'Title',
      type: 'string',
      name: 'title',
    },
    {
      title: 'Description',
      type: 'array',
      name: 'description',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      title: 'Child Constellations',
      name: 'childConstellations',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'constellation',
            },
          ],
        },
      ],
    },
  ],
}
