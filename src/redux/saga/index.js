import { takeEvery, all } from "@redux-saga/core/effects";

import {SET_MINTS,GET_MINTS } from "../actions/action";
import { getMints } from "./saga";

export function* watchOutFunctions() {
  yield all([takeEvery(GET_MINTS, getMints)]);
}
