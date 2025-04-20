import { apiSlice } from "./apiSlice";
const USERS_URL = "api/users";

const user = JSON.parse(localStorage.getItem("Access-token"));

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `api/auth/login`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
        body: new URLSearchParams(data).toString(),
      }),
    }),
    loginSocial: builder.mutation({
      query: (data) => ({
        url: `api/auth/login/social-media`,
        method: "POST",
        body: data,
      }),
    }),
    getUserGoogleData: builder.mutation({
      query: (data) => ({
        url: `https://www.googleapis.com/oauth2/v3/userinfo`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}/`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    getUserData: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/` + data.id,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    getActiveUserData: builder.query({
      query: () => ({
        url: `${USERS_URL}/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    updateUserData: builder.mutation({
      query: (data) => ({
        url: USERS_URL + "/" + data.id,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: data,
      }),
    }),
    deleteUserData: builder.mutation({
      query: (data) => ({
        url: USERS_URL + "/" + data.id,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginSocialMutation,
  useGetUserGoogleDataMutation,
  useRegisterMutation,
  useGetAllUsersQuery,
  useGetUserDataMutation,
  useLazyGetActiveUserDataQuery,
  useGetActiveUserDataQuery,
  useUpdateUserDataMutation,
  useDeleteUserDataMutation,
} = userApiSlice;
