import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface RejectedJobs {
  _id?: string;
  affiliate: string;
  job_id: string;
}

export const rejectedJobsSlice = createApi({
  reducerPath: "rejectedJobs",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/rejectedJobs`,
  }),
  tagTypes: ["RejectedJobs"],
  endpoints(builder) {
    return {
      getAllRejectedJobs: builder.query<RejectedJobs[], string | void>({
        query: (_id)=> {
          return `/getAllRejectedJobs/${_id}`;
        },
        providesTags: ["RejectedJobs"],
      }),
      addNewRejectedJob: builder.mutation<void, RejectedJobs>({
        query(payload) {
          return {
            url: "/newRejectedJob",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["RejectedJobs"],
      }),
    //   deleteSource: builder.mutation<void, Sources>({
    //     query: (_id) => ({
    //       url: `/deleteSource/${_id}`,
    //       method: "Delete",
    //     }),
    //     invalidatesTags: ["Sources"],
    //   }),
    };
  },
});

export const {
  useAddNewRejectedJobMutation,
  useGetAllRejectedJobsQuery,
//   useDeleteSourceMutation,
} = rejectedJobsSlice;
