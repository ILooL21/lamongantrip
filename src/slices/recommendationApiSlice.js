import { apiSlice } from "./apiSlice";
const RECOMMENDATION_URL = "api/recommendations";

const user = JSON.parse(localStorage.getItem("Access-token"));

export const recommendationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendations: builder.mutation({
      query: (data) => ({
        url: RECOMMENDATION_URL + "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: data,
      }),
    }),
    getUserRecommendationsLog: builder.mutation({
      query: () => ({
        url: RECOMMENDATION_URL + "/",
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
  }),
});

export const { useGetRecommendationsMutation, useGetUserRecommendationsLogMutation } = recommendationApiSlice;
