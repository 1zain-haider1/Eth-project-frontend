/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
 function parseJSON(response) {
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    return response.json();
  }
  
  /**
   * Parses the BLOBK returned by a network request
   *
   * @param  {object} response A response from a network request
   *
   * @return {object}          The parsed BLOB from the request
   */
  function parseBLOB(response) {
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    return response.blob();
  }
  
  /**
   * Checks if a network request came back fine, and throws an error if not
   *
   * @param  {object} response   A response from a network request
   *
   * @return {object|undefined} Returns either the response, or throws an error
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
  
    const error = new Error(response.statusText);
    error.statusCode = response.status;
    throw error;
  }
  
  /**
   * Requests a URL, returning a promise
   *
   * @param  {string} url       The URL we want to request
   * @param  {object} [options] The options we want to pass to "fetch"
   *
   * @return {object}           The response data
   */
  export default async function request(url, options, json = true) {
    // console.log(options)
  
    const fetchResponse = await fetch(url, options);
    const response = await checkStatus(fetchResponse);
    let data=await response.clone().json()
    // console.log(await response.json(), 'request response');
    // console.log(await response.json(),"response on request.js");
  
    // if (json) {
    //   return parseJSON(response);
    // }
    // return parseBLOB(response);
    return data;
  }
  