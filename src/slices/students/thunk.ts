import { createAsyncThunk } from '@reduxjs/toolkit';


//get all students 
export const getAllStudentsAsync = createAsyncThunk(
  "student/getAllStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/student/getAllStudents`
      );
      return response.json()
    } catch (err: any) {
      console.log("API Error:", err);
      return rejectWithValue(err.message);
    }
  }
);

export const addStudentAsync = createAsyncThunk(
  "student/registerStudent",
  async (studentBody: FormData, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/student/registerStudent`, {
        method: 'POST',
        body: studentBody,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage);
      }
      const data = await response.json();
      dispatch(getAllStudentsAsync());
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);