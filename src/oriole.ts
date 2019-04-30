import axios, { AxiosRequestConfig } from 'axios';
import { Token, OAuth, Header, RequestOptions } from './oauth';
import * as _ from 'lodash';
import * as crypto from 'crypto';

function hash_function_sha1(baseString: string, key: string): string {
  return crypto.createHmac('sha1', key).update(baseString).digest('base64');
}

export class Oriole {

  private oauth: OAuth;
  private accessToken: Token;

  constructor() {
    this.oauth = new OAuth({
      consumer: {
        key: '7pg4z9uoerwf5em0fajo9ky0ihkscj80',
        secret: 'bi1c6pp13mz36tujfn7375ic1teh2lny'
      },
      signatureMethod: 'HMAC-SHA1',
      hashFunction: hash_function_sha1
    });
    this.accessToken = {
      key: 'm6ar94w9782u3fnagbjtwscqs65t7lzw',
      secret: 'm0tqd4yyi2jrepqrsyuhhcwrvcs9xhmw'
    };
  }

  async apiCall(requestData: any, requestToken = ''): Promise<void> {
    const requestOptions: RequestOptions = {
      method: 'get',
      url: 'http://localhost:8080/rest/V1/products',
      data: requestData
    };
    let oAuthHeader: Header;
    if (requestToken && requestToken != '') {
      oAuthHeader = {
        'Authorization': 'Bearer ' + requestToken
      };
    } else {
      const authorization = this.oauth.authorize(requestOptions, this.accessToken);
      oAuthHeader = this.oauth.toHeader(authorization);
    }
    let commonHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    try {
      const axiosRequestOptions: AxiosRequestConfig = _.merge(requestOptions, { headers: _.merge(oAuthHeader, commonHeaders) });
      console.log('Request\n', axiosRequestOptions);
      const result = await axios(axiosRequestOptions);
      console.log('Result\n', result.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
  }
}
