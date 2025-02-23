import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../config/query.config';

export const rootApi = createApi({
    reducerPath: 'rootApi',
    baseQuery,
    tagTypes: [],
    endpoints: () => ({}),
});
