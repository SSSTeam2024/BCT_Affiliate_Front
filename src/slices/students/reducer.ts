import { createSlice } from '@reduxjs/toolkit';
import {getAllStudentsAsync, addStudentAsync } from './thunk';

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  id_creation_date: String;

}

type initialStateType = {
  students: Student[];
  error: string | null;
};

export const initialState: initialStateType = {
students: [],
error: null,
};

const studentSlice=createSlice({
  name:"Student",
  initialState:initialState,
  reducers:{
   },
  extraReducers: (builder) => {
      builder
        .addCase(addStudentAsync.fulfilled, (state, action) => {
          state.students.push(action.payload);
        })
        .addCase(addStudentAsync.rejected, (action) => {
          console.log(action.error); 
        })

        .addCase(getAllStudentsAsync.fulfilled, (state, action) => {
          state.students = action.payload;
        })
        
        .addCase(getAllStudentsAsync.rejected, (action) => {
          console.log(action.error);
        })
        
    
      
     
    },
      
    
})
export default studentSlice.reducer;