import { apiSlice } from "./apiSlice";
const ARTICLE_URL = "api/articles";

const user = JSON.parse(localStorage.getItem("Access-token"));

export const articleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createArticle: builder.mutation({
      query: (data) => ({
        url: ARTICLE_URL + "/",
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: data,
      }),
    }),
    getAllArticle: builder.query({
      query: () => ({
        url: ARTICLE_URL + "/",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    getArticleById: builder.mutation({
      query: (data) => ({
        url: ARTICLE_URL + "/" + data.id,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    getLatestArticle: builder.query({
      query: () => ({
        url: ARTICLE_URL + "/data/latest",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    updateArticle: builder.mutation({
      query: (data) => ({
        url: `${ARTICLE_URL}/${data.get("id_artikel")}/update`,
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: data,
      }),
    }),
    deleteArticle: builder.mutation({
      query: (data) => ({
        url: ARTICLE_URL + "/" + data.id + "/delete",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
  }),
});

export const { useCreateArticleMutation, useGetAllArticleQuery, useGetLatestArticleQuery, useGetArticleByIdMutation, useUpdateArticleMutation, useDeleteArticleMutation } = articleApiSlice;
