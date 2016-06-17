export const FETCH_REGION_DATA = 'FETCH_REGION_DATA';
//export const RECEIVE_REGION_DATA = 'RECEIVE_REGION_DATA';

//function receiveRegionData(data) {
  //console.log('in receiveRegionData');
  //console.log(data);
  //return {
    //type: RECEIVE_REGION_DATA,
    //regionData: data
  //};
//}

/* eslint no-unused-vars: [0] */
export function fetchRegionData(dispatch) {
  fetch('http://staging.elephantdatabase.org/api/continent/2/2013/add')
    .then(r => r.json())
    .then(d => dispatch({
      type: FETCH_REGION_DATA,
      data: d
    }));
}

//export function fetchRegionData() {
  //return dispatch => fetch('http://staging.elephantdatabase.org/api/continent/2/2013/add')
    //.then(r => r.json())
    //.then(d => {
      //console.log(d);
      //dispatch(receiveRegionData(d));
    //});
//}
