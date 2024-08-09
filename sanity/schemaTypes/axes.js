import {AsteriskIcon} from '@sanity/icons'

export default {
  name: 'axes',
  type: 'document',
  title: 'Axes',
  icon: AsteriskIcon,
  fields: [
    {
      title: 'Title',
      type: 'string',
      name: 'title',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Training Cycles', value: 'trainingCycles'},
          {title: '1st Cycle', value: 'firstCycle'},
          {title: '2nd Cycle', value: 'secondCycle'},
          {title: 'Master', value: 'master'},
          {title: 'Research', value: 'research'},
        ],
      },
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
      title: 'Children',
      name: 'children',
      type: 'array',
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
