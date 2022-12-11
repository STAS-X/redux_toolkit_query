import { PostValue } from '../interfaces';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postsApi = createApi({
	reducerPath: 'postsApi',
	tagTypes: ['Posts'],
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
	endpoints: (build) => ({
		getPosts: build.query<PostValue[], string | number>({
			query: (limit = '') => {
				return `posts?${limit && `_limit=${limit}`}`;
			},
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Posts' as const, id })),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: [{ type: 'Posts', id: 'LIST' }],
		}),
		addPost: build.mutation<PostValue, Partial<PostValue>>({
			query: (body) => ({
				url: 'posts',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
		}),
		deletePost: build.mutation<PostValue, string | number>({
			query: (id = '') => ({
				url: `posts/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
		}),
	}),
});

export const { useGetPostsQuery, useAddPostMutation, useDeletePostMutation } = postsApi;
