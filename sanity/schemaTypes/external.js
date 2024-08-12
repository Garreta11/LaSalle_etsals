import {PlugIcon} from '@sanity/icons'

export default {
  name: 'external',
  type: 'document',
  title: 'External Connections',
  icon: PlugIcon,
  fields: [
    {
      title: 'Title',
      type: 'string',
      name: 'title',
    },
    {
      title: 'Connection 1',
      name: 'connection1',
      type: 'reference',
      to: [
        {
          type: 'axes',
        },
        {
          type: 'constellation',
        },
      ],
    },
    {
      title: 'Connection 2',
      name: 'connection2',
      type: 'reference',
      to: [
        {
          type: 'axes',
        },
        {
          type: 'constellation',
        },
      ],
    },
  ],
}
