const Keywords = {
  slug: 'keywords',
  admin: {
    useAsTitle: 'term',
    defaultColumns: ['term', 'searchVolume', 'difficulty', 'priority', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'term',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Research', value: 'research' },
        { label: 'Ready to Write', value: 'ready' },
        { label: 'Writing', value: 'writing' },
        { label: 'Published', value: 'published' },
        { label: 'Needs Update', value: 'update' },
      ],
      defaultValue: 'research',
      required: true,
    },
    {
      name: 'searchVolume',
      type: 'number',
      admin: {
        description: 'Monthly search volume estimate.',
      },
    },
    {
      name: 'difficulty',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        description: 'Keyword difficulty score (0-100).',
      },
    },
    {
      name: 'cpc',
      type: 'number',
      admin: {
        description: 'Estimated cost per click ($).',
      },
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
      defaultValue: 'medium',
    },
    {
      name: 'cluster',
      type: 'text',
      admin: {
        description: 'Keyword cluster name (e.g., "seo-tools").',
      },
    },
    {
      name: 'headTerm',
      type: 'text',
      admin: {
        description: 'The consistent part of the pattern (e.g., "best CRM").',
      },
    },
    {
      name: 'modifier',
      type: 'text',
      admin: {
        description: 'The variable part (e.g., "for real estate").',
      },
    },
    {
      name: 'intent',
      type: 'select',
      options: [
        { label: 'Informational', value: 'informational' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Transactional', value: 'transactional' },
        { label: 'Navigational', value: 'navigational' },
      ],
    },
    {
      name: 'assignedArticle',
      type: 'relationship',
      relationTo: 'articles',
      admin: {
        description: 'Article targeting this keyword.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
};

export default Keywords;
