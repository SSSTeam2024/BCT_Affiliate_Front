import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Quote {
  _id?: string;
  passengers_number: number;
  affiliate_id: {
    _id?: string;
  };
  id_affiliate?: {
    _id?: string;
  };
  id_affiliate_vehicle: string;
  id_affiliate_driver: string;
  journey_type: string;
  estimated_start_time: string;
  estimated_return_start_time: string;
  destination_point: {
    placeName: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  start_point: {
    placeName: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  vehicle_type: string;
  id_visitor: string;
  school_id?: string;
  company_id?: string;
  notes: string;
  createdAt: Date;
  luggage_details: string;
  manual_cost: string;
  status: string;
  progress: string;
  balance: string;
  deposit: string;
  id_driver: string;
  id_vehicle: string;
  total_price: string;
  deposit_percentage: string;
  automatic_cost: string;
  deposit_amount: string;
  category?: string;
  date?: string;
  return_time?: string;
  pickup_time?: string;
  mid_stations: {
    id: string;
    address: string;
    time: string;
  }[],
  white_list: {
    id?: {
      _id?:string
    };
    progress: string,
    jobStatus? : string
  }[]
  pushed_price: string;
  noteAcceptJob: string;
  priceJob?: string;
  quote_ref?:string
}

export interface BookEmail {
  quote_id: string;
  id_visitor: string;
  price: number;
  automatic_cost: string;
  deposit_amount: string;
  deposit_percentage: string;
  total_price: string;
}

export interface AssignDriver {
  quote_id: string;
  id_visitor: string;
  manual_cost: string;
  id_vehicle: string;
  id_driver: string;
}

export interface AssignDriverAndVehicleToQuoteInterface {
  quote_ID: string;
  vehicle_ID: string;
  driver_ID: string;
}
export interface AssignAffiliateDriverAndVehicleToQuoteInterface {
  quote_ID: string;
  affiliateVehicle_ID: string;
  affiliateDriver_ID: string;
}

export interface AssignDriverToQuote {
  quote_id: string;
  id_driver: string;
}
export interface AssignAffiliateDriverToQuote {
  quote_id: string;
  id_affiliate_driver: string;
}

export interface AssignVehicleToQuote {
  quote_id: string;
  id_vehicle: string;
}
export interface AssignAffiliateVehicleToQuote {
  quote_id: string;
  id_affiliate_vehicle: string;
}

export interface CancelQuote {
  quoteId: string;
  status: string;
}
export interface CancelAffiliateQuote {
  quoteId: string;
  status: string;
}

export interface ProgressAffiliateQuote {
  id_quote: string;
  progress: string;
}


export interface SendPrice {
  idQuote: string;
  white_list: string[];
}

export interface SendAcceptJobStatus {
  idAffiliate: string;
  jobStatus: string;
  idQuote: string;
}

export interface SendRefuseJobStatus {
  id_Affiliate: string;
  job_Status: string;
  id_quote: string;
}

export const quoteSlice = createApi({
  reducerPath: "quote",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/quote`,
  }),
  tagTypes: [
    "Quote",
    "BookEmail",
    "AssignDriver",
    "AssignVehicleToQuote",
    "AssignDriverToQuote",
    "CancelQuote",
    "ConvertTo",
    "AssignDriverAndVehicleToQuoteInterface",
    "AssignAffiliateDriverToQuote",
    "AssignAffiliateDriverAndVehicleToQuoteInterface",
    "AssignAffiliateVehicleToQuote",
    "CancelAffiliateQuote",
    "ProgressAffiliateQuote",
    "SendPrice",
    "SendAcceptJobStatus",
    "SendRefuseJobStatus"
  ],
  endpoints(builder) {
    return {
      getAllQuote: builder.query<Quote[], number | void>({
        query() {
          return "/getAllQuotes";
        },
        providesTags: ["Quote"],
      }),
      getQuoteById: builder.query<Quote, number | void>({
        query: (_id) => ({
          url: `/getQuoteById/${_id}`,
          method: "GET",
        }),
        providesTags: ["Quote"],
      }),
      getQuoteByIdSchedule: builder.query<Quote[], { id_schedule: string }>({
        query: ({ id_schedule }) => ({
          url: `/getQuoteByIdSchedule`,
          method: "POST",
          body: { id_schedule: id_schedule },
        }),
        providesTags: ["Quote"],
      }),
      getAllSuggestedQuotesByAffiliateID: builder.query<Quote[], string | void>({
        query: (_id) => ({
          url: `/getAllSuggestedQuotesByAffiliateID/${_id}`,
          method: "GET",
        }),
        providesTags: ["Quote"],
      }),
      addSendBookEmail: builder.mutation<void, BookEmail>({
        query({
          id_visitor,
          price,
          quote_id,
          automatic_cost,
          deposit_amount,
          deposit_percentage,
          total_price,
        }) {
          return {
            url: "/sendBookingEmail",
            method: "POST",
            body: {
              id_visitor,
              price,
              quote_id,
              automatic_cost,
              deposit_amount,
              deposit_percentage,
              total_price,
            },
          };
        },
        invalidatesTags: ["BookEmail"],
      }),
      addAssignDriver: builder.mutation<void, AssignDriver>({
        query({ quote_id, manual_cost, id_visitor, id_vehicle, id_driver }) {
          return {
            url: "/assignDriver",
            method: "POST",
            body: { quote_id, manual_cost, id_visitor, id_vehicle, id_driver },
          };
        },
        invalidatesTags: ["Quote", "AssignDriver"],
      }),
      addDriverToQuote: builder.mutation<void, AssignDriverToQuote>({
        query({ quote_id, id_driver }) {
          return {
            url: "/assignDriverToQuote",
            method: "POST",
            body: { quote_id, id_driver },
          };
        },
        invalidatesTags: ["Quote", "AssignDriverToQuote"],
      }),
      updateStatusQuoteToCancel: builder.mutation<void, CancelQuote>({
        query({ quoteId, status }) {
          return {
            url: "/cancelQuote",
            method: "POST",
            body: { quoteId, status },
          };
        },
        invalidatesTags: ["Quote", "CancelQuote"],
      }),
      addVehicleToQuote: builder.mutation<void, AssignVehicleToQuote>({
        query({ quote_id, id_vehicle }) {
          return {
            url: "/assignVehicleToDriver",
            method: "POST",
            body: { quote_id, id_vehicle },
          };
        },
        invalidatesTags: ["Quote", "AssignVehicleToQuote"],
      }),
      deleteQuote: builder.mutation<void, Quote>({
        query: (_id) => ({
          url: `/deleteQuote/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Quote"],
      }),
      assignDriverAndVehicleToQuote: builder.mutation<
        void,
        AssignDriverAndVehicleToQuoteInterface
      >({
        query({ quote_ID, vehicle_ID, driver_ID }) {
          return {
            url: "/assignDriverAndVehicleToQuote",
            method: "POST",
            body: { quote_ID, vehicle_ID, driver_ID },
          };
        },
        invalidatesTags: ["Quote", "AssignDriverAndVehicleToQuoteInterface"],
      }),

      getAllAffiliateQuote: builder.query<Quote[], number | void>({
        query() {
          return "/getAffiliateQuotes";
        },
        providesTags: ["Quote"],
      }),
      addAffiliateDriverToQuote: builder.mutation<
        void,
        AssignAffiliateDriverToQuote
      >({
        query({ quote_id, id_affiliate_driver }) {
          return {
            url: "/assignAffiliateDriver",
            method: "POST",
            body: { quote_id, id_affiliate_driver },
          };
        },
        invalidatesTags: ["Quote", "AssignAffiliateDriverToQuote"],
      }),

      assignAffiliateDriverAndVehicleToQuote: builder.mutation<
        void,
        AssignAffiliateDriverAndVehicleToQuoteInterface
      >({
        query({ quote_ID, affiliateVehicle_ID, affiliateDriver_ID }) {
          return {
            url: "/assignAffiliateVehicleAndDriver",
            method: "POST",
            body: { quote_ID, affiliateVehicle_ID, affiliateDriver_ID },
          };
        },
        invalidatesTags: [
          "Quote",
          "AssignAffiliateDriverAndVehicleToQuoteInterface",
        ],
      }),

      addAffiliateVehicleToQuote: builder.mutation<
        void,
        AssignAffiliateVehicleToQuote
      >({
        query({ quote_id, id_affiliate_vehicle }) {
          return {
            url: "/assignAffiliateVehicle",
            method: "POST",
            body: { quote_id, id_affiliate_vehicle },
          };
        },
        invalidatesTags: ["Quote", "AssignAffiliateVehicleToQuote"],
      }),

      updateStatusAffiliateQuoteToCancel: builder.mutation<
        void,
        CancelAffiliateQuote
      >({
        query({ quoteId, status }) {
          return {
            url: "/cancelAffiliateQuote",
            method: "POST",
            body: { quoteId, status },
          };
        },
        invalidatesTags: ["Quote", "CancelAffiliateQuote"],
      }),

      // updateStatusAffiliateQuoteToRefuse: builder.mutation<
      //   void,
      //   CancelAffiliateQuote
      // >({
      //   query({ quoteId, status }) {
      //     return {
      //       url: "/updateAffiliateQuoteRefuse",
      //       method: "POST",
      //       body: { quoteId, status },
      //     };
      //   },
      //   invalidatesTags: ["Quote", "CancelAffiliateQuote"],
      // }),
      // updateStatusAffiliateQuoteToAccept: builder.mutation<
      //   void,
      //   CancelAffiliateQuote
      // >({
      //   query({ quoteId, status }) {
      //     return {
      //       url: "/updateAffiliateQuoteAccept",
      //       method: "POST",
      //       body: { quoteId, status },
      //     };
      //   },
      //   invalidatesTags: ["Quote", "CancelAffiliateQuote"],
      // }),
      deleteAffiliateQuote: builder.mutation<void, Quote>({
        query: (_id) => ({
          url: `/deleteAffiliateQuote/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Quote"],
      }),
      updateProgressQuoteAffiliate: builder.mutation<
        void,
        ProgressAffiliateQuote
      >({
        query({ id_quote, progress }) {
          return {
            url: "/updateAffiliateQuoteProgress",
            method: "POST",
            body: { id_quote, progress },
          };
        },
        invalidatesTags: ["Quote", "ProgressAffiliateQuote"],
      }),
      updateStatusAffiliateQuoteToRefuse: builder.mutation<void, { quoteId: string, affiliateId: string }>({
        query: ({ quoteId, affiliateId }) => ({
          url: "/updateAffiliateQuoteRefuse",
          method: "POST",
          body: { quoteId, affiliateId },
        }),
        invalidatesTags: ["Quote"],
      }),
      updateStatusAffiliateQuoteToAccept: builder.mutation<void, { quote: Quote, affiliateId: string }>({
        query: ({ quote, affiliateId }) => ({
          url: "/updateAffiliateQuoteAccept",
          method: "POST",
          body: {
            quoteId: quote?._id!,
            affiliateId: affiliateId,
            priceJob: quote?.priceJob!,
            noteAcceptJob: quote?.noteAcceptJob!,
          },
        }),
        invalidatesTags: ["Quote"],
      }),
      sendPriceandNotes: builder.mutation<void, SendPrice>({
        query: ({ idQuote, white_list }) => ({
          url: `sendPriceAndNotes`,
          method: "POST",
          body: { idQuote, white_list },
        }),
        invalidatesTags: ["SendPrice"],
      }),
      sendAcceptJobStatus: builder.mutation<void, SendAcceptJobStatus>({
        query: ({ idAffiliate, jobStatus, idQuote }) => ({
          url: `sendAcceptJobStatus`,
          method: "POST",
          body: { idAffiliate, jobStatus, idQuote },
        }),
        invalidatesTags: ["SendAcceptJobStatus"],
      }),
      sendRefuseJobStatus: builder.mutation<void, SendRefuseJobStatus>({
        query: ({ id_Affiliate, job_Status, id_quote }) => ({
          url: `sendRefuseJobStatus`,
          method: "POST",
          body: { id_Affiliate, job_Status, id_quote },
        }),
        invalidatesTags: ["SendAcceptJobStatus"],
      }),
    };
  },
});

export const {
  useGetAllQuoteQuery,
  useAddSendBookEmailMutation,
  useAddAssignDriverMutation,
  useGetQuoteByIdQuery,
  useAddDriverToQuoteMutation,
  useAddVehicleToQuoteMutation,
  useUpdateStatusQuoteToCancelMutation,
  useGetQuoteByIdScheduleQuery,
  useDeleteQuoteMutation,
  useAssignDriverAndVehicleToQuoteMutation,
  useGetAllAffiliateQuoteQuery,
  useAddAffiliateDriverToQuoteMutation,
  useAssignAffiliateDriverAndVehicleToQuoteMutation,
  useAddAffiliateVehicleToQuoteMutation,
  useUpdateStatusAffiliateQuoteToCancelMutation,
  useDeleteAffiliateQuoteMutation,
  useUpdateStatusAffiliateQuoteToAcceptMutation,
  useUpdateStatusAffiliateQuoteToRefuseMutation,
  useUpdateProgressQuoteAffiliateMutation,
  useSendPriceandNotesMutation,
  useSendAcceptJobStatusMutation,
  useSendRefuseJobStatusMutation,
  useGetAllSuggestedQuotesByAffiliateIDQuery
} = quoteSlice;
