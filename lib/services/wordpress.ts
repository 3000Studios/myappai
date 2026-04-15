/**
 * WordPress Service
 * Integration with WordPress backend for content management
 */

import axios from 'axios';

const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WP_PASS;

const wpApi = axios.create({
  baseURL: `${WP_URL}/wp-json/wp/v2`,
  auth: {
    username: WP_USER || '',
    password: WP_PASS || '',
  },
});

export interface WordPressPost {
  id?: number;
  title: string;
  content: string;
  excerpt?: string;
  status: 'publish' | 'draft' | 'pending';
  categories?: number[];
  tags?: number[];
  featured_media?: number;
}

export async function createPost(post: WordPressPost): Promise<number> {
  try {
    const response = await wpApi.post('/posts', {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      status: post.status,
      categories: post.categories || [],
      tags: post.tags || [],
      featured_media: post.featured_media || 0,
    });

    return response.data.id;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to create WordPress post');
  }
}

export async function updatePost(id: number, updates: Partial<WordPressPost>): Promise<void> {
  try {
    await wpApi.put(`/posts/${id}`, updates);
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to update WordPress post');
  }
}

export async function getPosts(limit: number = 10): Promise<WordPressPost[]> {
  try {
    const response = await wpApi.get('/posts', {
      params: {
        per_page: limit,
        _embed: true,
      },
    });

    return response.data.map((post: Record<string, unknown>) => {
      const title = post.title as Record<string, unknown> | undefined;
      const content = post.content as Record<string, unknown> | undefined;
      const excerpt = post.excerpt as Record<string, unknown> | undefined;

      return {
        id: post.id as number,
        title: title?.rendered as string,
        content: content?.rendered as string,
        excerpt: excerpt?.rendered as string,
        status: post.status as 'publish' | 'draft' | 'pending',
      };
    });
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to fetch WordPress posts');
  }
}

export async function deletePost(id: number): Promise<void> {
  try {
    await wpApi.delete(`/posts/${id}`, {
      params: { force: true },
    });
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to delete WordPress post');
  }
}

export async function getCategories(): Promise<Array<{ id: number; name: string }>> {
  try {
    const response = await wpApi.get('/categories');
    return response.data.map((cat: Record<string, unknown>) => ({
      id: cat.id,
      name: cat.name,
    }));
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to fetch categories');
  }
}

export async function createCategory(name: string, description?: string): Promise<number> {
  try {
    const response = await wpApi.post('/categories', {
      name,
      description: description || '',
    });
    return response.data.id;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to create category');
  }
}

