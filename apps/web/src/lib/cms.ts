// Payload CMS API Client
const CMS_URL = import.meta.env.CMS_URL || 'http://localhost:3001';

async function fetchFromCMS(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${CMS_URL}/api/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`CMS Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getArticles(limit = 100, page = 1, category?: string) {
  const params: Record<string, string> = {
    limit: String(limit),
    page: String(page),
    depth: '2',
    sort: '-publishedDate',
    where: JSON.stringify({ status: { equals: 'published' } }),
  };
  if (category) {
    params.where = JSON.stringify({
      and: [
        { status: { equals: 'published' } },
        { 'category.slug': { equals: category } },
      ],
    });
  }
  return fetchFromCMS('articles', params);
}

export async function getArticleBySlug(slug: string) {
  const params = {
    where: JSON.stringify({ slug: { equals: slug } }),
    depth: '2',
  };
  const data = await fetchFromCMS('articles', params);
  return data.docs?.[0] || null;
}

export async function getCategories() {
  return fetchFromCMS('categories', { limit: '100', depth: '1' });
}

export async function getCategoryBySlug(slug: string) {
  const params = {
    where: JSON.stringify({ slug: { equals: slug } }),
  };
  const data = await fetchFromCMS('categories', params);
  return data.docs?.[0] || null;
}

export async function getKeywords(limit = 100, status?: string) {
  const params: Record<string, string> = { limit: String(limit) };
  if (status) {
    params.where = JSON.stringify({ status: { equals: status } });
  }
  return fetchFromCMS('keywords', params);
}

export async function getSiteSettings() {
  try {
    return fetchFromCMS('globals/site-settings');
  } catch {
    return null;
  }
}
