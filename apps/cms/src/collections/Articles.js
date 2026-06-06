const Articles = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'category', 'publishedDate', 'updatedAt'],
    preview: (doc) => {
      if (doc?.slug) {
        return `${process.env.PAYLOAD_PUBLIC_WEB_URL}/blog/${doc.slug}`;
      }
      return null;
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'keywords',
      type: 'relationship',
      relationTo: 'keywords',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Used for meta description and card previews.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'metaTitle',
      type: 'text',
      maxLength: 60,
      admin: {
        description: 'Overrides default title for SEO.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      maxLength: 160,
      admin: {
        description: 'Overrides default excerpt for SEO.',
      },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      admin: {
        description: 'Override canonical URL if republishing.',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Minutes to read.',
      },
    },
    {
      name: 'allowComments',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'monetization',
      type: 'group',
      fields: [
        {
          name: 'affiliateLinks',
          type: 'array',
          fields: [
            { name: 'productName', type: 'text', required: true },
            { name: 'affiliateUrl', type: 'text', required: true },
            { name: 'ctaText', type: 'text', defaultValue: 'Check Price' },
            { name: 'priority', type: 'number', defaultValue: 1 },
          ],
        },
        {
          name: 'displayAdSlots',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Above Content', value: 'above-content' },
            { label: 'Below Content', value: 'below-content' },
            { label: 'Inline Paragraph 3', value: 'inline-p3' },
            { label: 'Sidebar', value: 'sidebar' },
          ],
        },
        {
          name: 'leadGenForm',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'leadGenHeadline',
          type: 'text',
          defaultValue: 'Get our free guide delivered to your inbox',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString();
        }
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }
        if (data.content && !data.readingTime) {
          const text = JSON.stringify(data.content);
          const words = text.split(/\s+/).length;
          data.readingTime = Math.ceil(words / 200);
        }
        return data;
      },
    ],
  },
};

export default Articles;
