import {StarFilledIcon} from '@sanity/icons'

export default {
  name: 'constellation',
  type: 'document',
  title: 'Constellation',
  icon: StarFilledIcon,
  groups: [
    {
      name: 'structure',
      title: 'Structure',
      default: true,
    },
    {
      name: 'externalConnections',
      title: 'External Connections',
    },
  ],
  fields: [
    {
      title: 'Title',
      type: 'string',
      name: 'title',
      group: 'structure',
    },
    {
      title: 'Description',
      type: 'array',
      name: 'description',
      group: 'structure',
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
      group: 'structure',
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
    {
      title: 'External Connections',
      name: 'external',
      type: 'array',
      group: 'externalConnections',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'axes',
            },
          ],
        },
      ],
    },
  ],
}
