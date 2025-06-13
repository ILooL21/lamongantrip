import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

// Tidak ada perubahan di sini, ini sudah benar.
const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
  }),
  endpoints: () => ({}),
});

const googleApiSlice = createApi({
  reducerPath: "googleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.googleapis.com/oauth2/v3",
  }),
  endpoints: (builder) => ({
    getUserGoogleData: builder.mutation({
      query: (data) => ({
        url: `/userinfo`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }),
    }),
  }),
});

export { apiSlice, googleApiSlice };
export const { useGetUserGoogleDataMutation } = googleApiSlice;
