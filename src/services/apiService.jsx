import axios from "axios";

export const API_URL="http://localhost:3000" 

export const doApiGet = async (_url) => {
  try {
    let data = await axios.get(API_URL+_url, {
      headers: {
        'x-api-key': localStorage["Health_Risk_Assessment"],
        'content-type': "application/json"
      }
    });
    return data;
  }
  catch(error){
    console.log(error.response.data);
    throw error
  }
}

export const doApiMethod = async (_url,_method,_body) => {
    try {
      let data = await axios({
        method:_method,
        url:API_URL+_url,
        data: JSON.stringify(_body),
        headers:{
          'x-api-key': localStorage["Health_Risk_Assessment"],
          'content-type': "application/json"
        }
      });
      return data;
    }
    catch(error){
      console.log(error ,error.response);
      throw error
    }
  }