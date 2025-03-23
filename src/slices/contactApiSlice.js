import { apiSlice } from "./apiSlice";
const CONTACT_URL = "/contact";

const user = JSON.parse(localStorage.getItem("Access-token"));

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (data) => ({
        url: CONTACT_URL + "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    getAllMail: builder.query({
      query: () => ({
        url: CONTACT_URL + "/",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    getMailById: builder.query({
      query: (id) => ({
        url: CONTACT_URL + "/" + id,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    deleteMail: builder.mutation({
      query: (data) => ({
        url: CONTACT_URL + "/" + data.id + "/delete",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    replyMail: builder.mutation({
      query: (data) => ({
        url: CONTACT_URL + "/" + data.id + "/reply",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: data,
      }),
    }),
  }),
});

export const { useCreateContactMutation, useGetAllMailQuery, useGetMailByIdQuery, useDeleteMailMutation, useReplyMailMutation } = contactApiSlice;
