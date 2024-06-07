import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type AuthState = {
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
};

const slice = createSlice({
  name: "authAffiliate",
  initialState: {
    affiliate: {
      _id: "",
      name: "",
      address: "",
      email: "",
      phone: "",
      category: "",
      notes: "",
      fleetNumber: "",
      enquiryDate: "",
      coverageDistance: "",
      coverageArea: [{
        placeName: "",
        coordinates: {
          lat: "",
          lng: ""
        },
        raduis: ""
      }],
      years_experience: "",
      website: "",
      service_date: "",
      statusAffiliate: "",
      account_name: "",
      sort_code: "",
      account_number: "",
      bank_name: "",
      login: "",
      password: "",
      api_token: "",
      vehicles: [{
        type: "",
        qty: ""
      }],
      progress: "",
      avatar: "",
    avatarBase64String: "",
    avatarExtension: "",
      insurance_date: "",
      insurance_number: "",
      insuranceFileBase64String: "",
      InsuranceFileExtension: "",
      insurance_file: "",
      id_creation_date: "",
      number_file: "",
      id_file: "",
      IdFileExtension: "",
      IdFileBase64String: "",
      priceJob: "",
      noteAcceptJob: "",
      statusJob: ""
    },
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { affiliate },
      }: PayloadAction<{
        affiliate: any;
      }>
    ) => {
      state.affiliate = affiliate;
    },
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) =>
  state.authAffiliate.affiliate;
