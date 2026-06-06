import { buildConfig } from 'payload/config';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { webpackBundler } from '@payloadcms/bundler-webpack';

// Collections
import Articles from './collections/Articles.js';
import Categories from './collections/Categories.js';
import Keywords from './collections/Keywords.js';
import Media from './collections/Media.js';
import Users from './collections/Users.js';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Programmatic SEO CMS',
      ogImage: '/assets/seo-og.jpg',
      favicon: '/assets/favicon.ico',
    },
  },
  collections: [
    Users,
    Articles,
    Categories,
    Keywords,
    Media,
  ],
  globals: [
    {
      slug: 'site-settings',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          required: true,
          defaultValue: 'Programmatic SEO Hub',
        },
        {
          name: 'siteDescription',
          type: 'textarea',
          required: true,
          defaultValue: 'Your source for expert guides, reviews, and insights.',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'analyticsId',
          type: 'text',
          label: 'Google Analytics ID',
        },
        {
          name: 'adsenseClientId',
          type: 'text',
          label: 'Google AdSense Client ID (ca-pub-XXXXXXXX)',
        },
        {
          name: 'affiliateDisclosure',
          type: 'textarea',
          defaultValue: 'This post contains affiliate links. We may earn a commission.',
        },
      ],
    },
  ],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgres://localhost:5432/payload',
    },
  }),
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
});
