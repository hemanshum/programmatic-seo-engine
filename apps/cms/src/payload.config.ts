import { buildConfig } from 'payload/config';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Collections
import Articles from './collections/Articles.js';
import Categories from './collections/Categories.js';
import Keywords from './collections/Keywords.js';
import Media from './collections/Media.js';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Programmatic SEO CMS',
      ogImage: '/assets/seo-og.jpg',
      favicon: '/assets/favicon.ico',
    },
  },
  collections: [
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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.sqlite',
    },
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
});
