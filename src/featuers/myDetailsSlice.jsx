import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "test1",
  email: "test1@gmail.com",
  idMorInfoAdmin: "0",
  ifShowNav: false,
  isAdmin: false,
}

const myDetailsSlice = createSlice({
  name: "myDetails",
  initialState,
  reducers: {
    addName: (start, activation) => {
      start.name = activation.payload.name;
    },
    addEmail: (start, activation) => {
      start.email = activation.payload.email;
    },
    addIdMorInfoAdmin: (start, activation) => {
      start.idMorInfoAdmin = activation.payload.idMorInfoAdmin;
    },
    addIfShowNav: (start, activation) => {
      start.ifShowNav = activation.payload.ifShowNav;
    },
    addIsAdmin: (start, activation) => {
      start.isAdmin = activation.payload.isAdmin;
    },
  }
})

export const {
  addName,
  addEmail,
  addIdMorInfoAdmin,
  addIfShowNav,
  addIsAdmin
} = myDetailsSlice.actions
export default myDetailsSlice.reducer