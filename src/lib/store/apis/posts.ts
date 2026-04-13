import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../config/baseQuery';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  sortBy?: 'id' | 'title' | 'body';
  sortOrder?: 'asc' | 'desc';
  userId?: number;
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery,
  tagTypes: ['Post', 'Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query<PostsResponse, GetPostsParams>({
      query: ({ page = 1, limit = 10, sortBy = 'id', sortOrder = 'asc', userId }) => {
        const params = new URLSearchParams();
        params.set('_page', page.toString());
        params.set('_limit', limit.toString());
        params.set('_sort', sortBy);
        params.set('_order', sortOrder);
        if (userId) params.set('userId', userId.toString());
        return `/posts?${params}`;
      },
      transformResponse: (response: Post[], meta) => {
        const total = Number(meta?.response?.headers.get('X-Total-Count')) || response.length;
        const params = new URLSearchParams(meta?.response?.url?.split('?')[1] || '');
        const page = Number(params.get('_page')) || 1;
        const limit = Number(params.get('_limit')) || 10;
        return { data: response, total, page, limit, totalPages: Math.ceil(total / limit) };
      },
      providesTags: (result) => result 
        ? [{ type: 'Posts', id: `page-${result.page}` }] 
        : ['Posts'],
    }),
    getPost: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation<Post, Omit<Post, 'id'>>({
      query: (body) => ({ url: '/posts', method: 'POST', body }),
      invalidatesTags: ['Posts'],
    }),
    updatePost: builder.mutation<Post, Post>({
      query: (body) => ({ url: `/posts/${body.id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, body) => [
        { type: 'Post', id: body.id },
        'Posts',
      ],
    }),
    deletePost: builder.mutation<number, number>({
      query: (id) => ({ url: `/posts/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }, 'Posts'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;