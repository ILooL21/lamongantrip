import { apiSlice } from "./apiSlice";
const DESTINATION_URL = "api/destinations";

const user = JSON.parse(localStorage.getItem("Access-token"));

export const destinationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDestinations: builder.query({
      query: () => ({
        url: `${DESTINATION_URL}/`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    getDestinationById: builder.mutation({
      query: (data) => ({
        url: `${DESTINATION_URL}/${data.id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
    createDestination: builder.mutation({
      query: (data) => ({
        url: DESTINATION_URL + "/",
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: data,
      }),
    }),
    updateDestination: builder.mutation({
      query: (data) => ({
        url: `${DESTINATION_URL}/${data.get("id_tempat_wisata")}/update`,
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: data,
      }),
    }),
    deleteDestination: builder.mutation({
      query: (data) => ({
        url: DESTINATION_URL + "/" + data.id + "/delete",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      }),
    }),
  }),
});

export const { useGetAllDestinationsQuery, useGetDestinationByIdMutation, useCreateDestinationMutation, useDeleteDestinationMutation, useUpdateDestinationMutation } = destinationApiSlice;
