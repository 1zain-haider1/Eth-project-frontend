
export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";
export const CLEAR = "CLEAR";
export const SET_MINTS="SET_MINTS";
export const GET_MINTS="GET_MINTS";
export const GET_AUCTION="GET_AUCTION";
export const SET_AUCTION="SET_AUCTION"

export const Actions = {
  
  setMints(data) {
  
    return { type: SET_MINTS,data };
  },
  getMints(){
    return { type: GET_MINTS};
  },
  setAuction(data){
    console.log(data,"setting auction updated")
    return {type:SET_AUCTION,payload:data}
  },
  clear(payload) {
    return { type: CLEAR, payload };
  },

}
