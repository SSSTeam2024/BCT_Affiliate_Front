import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type AuthState = {
    school: {
        _id?: string;
        name: string;
        login: string;
        password: string;
        email: string;
        phone: string;
        activity: string;
        address: string;
        status: string;
        legal_status: string;
        account_name: string;
        sort_code: number;
        account_number: number;
        bank_name: string;
        id_creation_date: string;
        id_file: string;
        api_token: string
      };
};

const slice = createSlice({
  name: "auth",
  initialState: { school: {
    _id: "",
    name: "",
    login: "",
    password: "",
    email: "",
    phone: "",
    activity: "",
    address: "",
    status: "",
    legal_status: "",
    account_name: "",
    sort_code: 0,
    account_number: 0,
    bank_name: "",
    id_creation_date: "",
    id_file: "",
    api_token: ""
  } } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: {  school },
      }: PayloadAction<{
        school: any}>
    ) => {
      state.school = school;
    },
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.school;