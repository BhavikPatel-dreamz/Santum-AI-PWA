import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../config/baseQuery';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery,
  tagTypes: ['User', 'Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: (result) => result
        ? [...result.map(({ id }) => ({ type: 'User' as const, id })), 'Users']
        : ['Users'],
    }),
    getUser: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery } = usersApi;