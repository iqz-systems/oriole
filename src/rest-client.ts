import axios, { AxiosResponse, AxiosError } from 'axios';
import * as crypto from 'crypto';
import { OAuth, ITokenPair, AuthorizationHeader } from './oauth';

export class RestClient {

  serverUrl: string;
  storeId: string;
  apiVersion: string;
  oAuth?: OAuth;
  token: ITokenPair | string;

  constructor(options: IRestClientOptions) {
    this.serverUrl = options.url;
    this.storeId = options.storeId;
    this.apiVersion = options.apiVersion;

    if (options.oauth) {
      this.oAuth = new OAuth({
        consumer: {
          key: options.oauth.consumerKey,
          secret: options.oauth.consumerSecret
        },
        signatureMethod: 'HMAC-SHA1',
        hashFunction: (baseString: string, key: string): string => {
          return crypto.createHmac('sha1', key).update(baseString).digest('base64');
        }
      });
      this.token = {
        key: options.oauth.accessToken,
        secret: options.oauth.accessTokenSecret
      };
    } else if (options.bearer) {
      this.token = options.bearer.token;
    } else {
      throw new Error('Either oauth or bearer options are required.');
    }
  }

  private getHeaders(requestData: ApiCallRequestData): AuthorizationHeader {
    if (this.oAuth) {
      return this.oAuth.toHeader(this.oAuth.authorize(requestData, this.token as ITokenPair));
    }
    return new AuthorizationHeader(this.token as string);
  }

  private async apiCall(requestData: ApiCallRequestData): Promise<any> {
    try {
      const result = await axios({
        url: requestData.url,
        method: requestData.method,
        headers: this.getHeaders(requestData)
      });
      return result.data;
    } catch (error) {
      if (error instanceof String) {
        throw error;
      }
      const axError = error as AxiosError;
      if (axError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (!this.isHttpCallSucceeded(axError.response)) {
          if (axError.response.data.message) {
            const errorMessage = this.errorString(axError.response.data.message, axError.response.data.parameters);
            throw errorMessage;
          } else if (axError.response.data.messages) {
            throw axError.response.data.messages.error;
          } else {
            throw axError;
          }
        }
        throw axError.response.data;
      }
      if (axError.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        throw axError.request
      }
      throw axError.message;
    }
  }

  private createUrl(resourceUrl: string) {
    return this.serverUrl + '/' + this.storeId + '/' + this.apiVersion + resourceUrl;
  }

  async get(resourceUrl: string): Promise<any> {
    const requestData = {
      url: this.createUrl(resourceUrl),
      method: 'GET'
    };
    return await this.apiCall(requestData);
  }

  async post(resourceUrl: string, data: object): Promise<any> {
    const requestData = {
      url: this.createUrl(resourceUrl),
      method: 'POST',
      body: data
    };
    return await this.apiCall(requestData);
  }

  async put(resourceUrl: string, data: object): Promise<any> {
    const requestData = {
      url: this.createUrl(resourceUrl),
      method: 'PUT',
      body: data
    };
    return await this.apiCall(requestData);
  }

  async delete(resourceUrl: string): Promise<any> {
    const requestData = {
      url: this.createUrl(resourceUrl),
      method: 'DELETE'
    };
    return await this.apiCall(requestData);
  }

  private isHttpCallSucceeded(response: AxiosResponse): boolean {
    return (response.status >= 200) && (response.status < 300);
  }

  private errorString(message: string, parameters: string[] | IResultObject): string {
    if (parameters === null) {
      return message;
    }

    if (parameters instanceof Array) {
      for (let i = 0; i < parameters.length; i++) {
        const parameterPlaceholder = '%' + (i + 1).toString();
        message = message.replace(parameterPlaceholder, parameters[i]);
      }
    } else if (parameters instanceof Object) {
      for (let key in parameters) {
        const parameterPlaceholder = '%' + key;
        message = message.replace(parameterPlaceholder, parameters[key]);
      }
    }

    return message;
  }
}

interface IResultObject {
  [key: string]: string;
}

export interface ApiCallRequestData {
  url: string;
  method: string;
  data?: object;
}

export interface IRestClientOptions {
  url: string;
  storeId: string;
  apiVersion: string;
  oauth?: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  },
  bearer?: {
    token: string;
  }
}
