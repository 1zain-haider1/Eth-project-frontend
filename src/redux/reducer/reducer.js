import { speedDialActionClasses } from "@mui/material";
import { combineReducers } from "redux";

import {INCREMENT,DECREMENT,CLEAR,SET_MINTS,SET_AUCTION} from '../actions/action'

const initialState={
    mints:null,
    auctions:null,
}
function counter(state = initialState, action) {
  switch (action.type) {
    // case GIF_FETCH_START:
    //old syntax of ES5
    //   return Object.assign({}, state, { url: "", loading: true });
    case SET_MINTS:
      return { ...state, mints: action.data };
     case SET_AUCTION:
       console.log(action.payload,"action.payload")
       return {...state,auctions:action.payload}
    default:
      return state;
  }
}

export default counter;
