import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";

export interface UserResponse {
  affiliate: {
    _id?: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    category: string;
    notes: string;
    fleetNumber: string;
    enquiryDate: string;
    coverageDistance: string;
    coverageArea: {
      placeName: string,
      coordinates: {
        lat: string,
        lng: string
      },
      raduis: string
    }[];
    years_experience: string;
    website: string;
    service_date: string;
    statusAffiliate?: string;
    account_name: string;
    sort_code: string;
    account_number: string;
    bank_name: string;
    login: string;
    password: string;
    api_token: string;
    vehicles: {
      type: string,
      qty: string
      }[];
    progress: string;
    avatar: string;
    avatarBase64String: string;
    avatarExtension: string;
    insurance_date: string;
    insurance_number: string;
    insuranceFileBase64String: string;
    InsuranceFileExtension: string;
    insurance_file: string;
    id_creation_date: string;
    number_file: string;
    id_file: string;
    IdFileExtension: string;
    IdFileBase64String: string;
    priceJob: string;
    noteAcceptJob: string;
    statusJob: string;
  };
}
export interface Affiliate {
  accessToken: string;
  affiliate: {
    _id?: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    category: string;
    notes: string;
    fleetNumber: string;
    enquiryDate: string;
    coverageDistance: string;
    coverageArea: {
      placeName: string,
      coordinates: {
        lat: string,
        lng: string
      },
      raduis: string
    }[];
    years_experience: string;
    website: string;
    service_date: string;
    statusAffiliate?: string;
    account_name: string;
    sort_code: string;
    account_number: string;
    bank_name: string;
    login: string;
    password: string;
    api_token: string;
    vehicles: {
      type: string,
      qty: string
      }[];
    progress: string;
    avatar: string;
    avatarBase64String: string;
    avatarExtension: string;
    insurance_date: string;
    insurance_number: string;
    insuranceFileBase64String: string;
    InsuranceFileExtension: string;
    insurance_file: string;
    id_creation_date: string;
    number_file: string;
    id_file: string;
    IdFileExtension: string;
    IdFileBase64String: string;
    priceJob: string;
    noteAcceptJob: string;
    statusJob: string;
  };
}

export interface AffiliateAccount {
  _id?: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  category: string;
  notes: string;
  fleetNumber: string;
  enquiryDate: string;
  coverageDistance: string;
  coverageArea: {
    placeName: string,
    coordinates: {
      lat: string,
      lng: string
    },
    raduis: string
  }[];
  years_experience: string;
  website: string;
  service_date: string;
  statusAffiliate?: string;
  account_name: string;
  sort_code: string;
  account_number: string;
  bank_name: string;
  login: string;
  password: string;
  api_token: string;
  vehicles: {
    type: string,
    qty: string
    }[];
  progress: string;
  avatar: string;
    avatarBase64String: string;
    avatarExtension: string;
  insurance_date: string;
  insurance_number: string;
  insuranceFileBase64String: string;
  InsuranceFileExtension: string;
  insurance_file: string;
  id_creation_date: string;
  number_file: string;
  id_file: string;
  IdFileExtension: string;
  IdFileBase64String: string;
  priceJob: string;
  noteAcceptJob: string;
  statusJob: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export const affiliateSlice = createApi({
  reducerPath: "affiliate",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/affiliate`,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).authAffiliate?.affiliate
        .api_token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Affiliate", "AffiliateAccount"],
  endpoints(builder) {
    return {
      login: builder.mutation<UserResponse, LoginRequest>({
        query: (credentials) => ({
          url: "/loginAffiliate",
          method: "POST",
          body: credentials,
        }),
      }),
      updateAffiliate: builder.mutation<void, AffiliateAccount>({
        query: ({ _id, ...rest }) => ({
          url: `/updateAffiliate/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["AffiliateAccount"],
      }),
      getAllQuotesByAffiliateID: builder.query<any[], string | void>({
        query: (_id) => ({
          url: `/getAllQuotesByAffiliateID/${_id}`,
          method: "GET",
        }),
        // providesTags: ["Driver"],
      }),

    };
  },

});

export const {
  useLoginMutation,
  useUpdateAffiliateMutation,
  useGetAllQuotesByAffiliateIDQuery,
} = affiliateSlice;
