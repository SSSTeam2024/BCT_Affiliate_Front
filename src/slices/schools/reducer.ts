import { createSlice } from '@reduxjs/toolkit';
import {loginSchoolAsync  } from './thunk';

export interface School {
  _id: string;
  login: string;
  password: string;
}

interface AuthState {
    accessToken: string | null;
    error: string | null;
  }
  
  const initialState: AuthState = {
    accessToken: null,
    error: null,
  };

// type initialStateType = {
//   schools: School[];
//   error: string | null;
// };

// export const initialState: initialStateType = {
// schools: [],
// error: null,
// };

const SchoolSlice=createSlice({
  name:"School",
  initialState:initialState,
  reducers:{
   },
   extraReducers: (builder) => {
    builder.addCase(loginSchoolAsync.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.error = null;
    });
    builder.addCase(loginSchoolAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
      
    
})
export default SchoolSlice.reducer;