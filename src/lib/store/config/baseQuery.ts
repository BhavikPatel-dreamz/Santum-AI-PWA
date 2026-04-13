import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});