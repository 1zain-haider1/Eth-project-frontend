import {  call, put } from 'redux-saga/effects';
import {Actions} from '../actions/action';
import axios from 'axios'
import  request  from '../../utils/request.js';


export function* getMints(){
  const BaseUrl = process.env.REACT_APP_BASE_URL;
  const  response = yield call(request, BaseUrl+"/nfts/listNfts");  
  
    yield put(Actions.setMints(response));
  
}




