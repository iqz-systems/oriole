import * as _ from 'lodash';
import { Consumer } from './consumer.interface';
import { Options } from './options.interface';
import { RequestOptions } from './request-options.interface';
import { Token } from './token.interface';
import { Authorization } from './authorization.interface';
import { Data } from './data.interface';
import { Header } from './header.interface';
import { Param } from './param.interface';

export class OAuth {
  consumer: Consumer;
  lastAmpersand: boolean;
  nonceLength: number;
  parameterSeparator: string;
  realm?: string;
  signatureMethod: string;
  version: string;

  hashFunction: (baseString: string, key: string) => string;
  bodyHashFunction: (baseString: string, key: string) => string;

  constructor(opts: Options) {
    this.consumer = opts.consumer;
    this.nonceLength = opts.nonceLength;
    this.version = opts.version || '1.0';
    this.parameterSeparator = opts.parameterSeparator || ', ';
    this.realm = opts.realm;
    if (opts.lastAmpersand) {
      this.lastAmpersand = opts.lastAmpersand;
    } else {
      this.lastAmpersand = true;
    }
    this.signatureMethod = opts.signatureMethod || 'PLAINTEXT';

    if (this.signatureMethod == 'PLAINTEXT' && !opts.hashFunction) {
      opts.hashFunction = (_baseString: string, key: string): string => {
        return key;
      }
    }
    if (!opts.hashFunction) {
      throw new Error('hashFunction option is required');
    }
    this.hashFunction = opts.hashFunction;
    this.bodyHashFunction = opts.bodyHashFunction || this.hashFunction;
  }

  /**
   * OAuth request authorize
   * @method authorize
   * @param  request   data
   * @param  token     key and secret token
   * @return           OAuth Authorized data
   */
  authorize(request: RequestOptions, token: Token): Authorization {
    const oAuthData: Authorization = {
      oauth_consumer_key: this.consumer.key,
      oauth_nonce: this.getNonce(),
      oauth_signature_method: this.signatureMethod,
      oauth_timestamp: this.getTimeStamp(),
      oauth_version: this.version,
      oauth_token: (token.key !== undefined) ? token.key : undefined,
      oauth_body_hash: (request.includeBodyHash) ? this.getBodyHash(request, token.secret) : undefined,
      oauth_signature: ''
    };

    oAuthData.oauth_signature = this.getSignature(request, token.secret, oAuthData);

    return oAuthData;
  }

  /**
   * Create a OAuth Signature
   * @method getSignature
   * @param  request      data
   * @param  tokenSecret  key and secret token
   * @param  oauthData    OAuth data
   * @return              The signature
   */
  getSignature(request: RequestOptions, tokenSecret: string | undefined, oauthData: Data): string {
    return this.hashFunction(this.getBaseString(request, oauthData), this.getSigningKey(tokenSecret));
  }

  /**
   * Create a OAuth Body Hash
   * @method getBodyHash
   * @param  request      data
   * @param  tokenSecret  key and secret token
   * @return              The body hash
   */
  getBodyHash(request: RequestOptions, tokenSecret: string | undefined): string {
    const body = (typeof request.data == 'string') ? request.data : JSON.stringify(request.data);

    if (!this.bodyHashFunction) {
      throw new Error('bodyHashFunction option is required');
    }
    return this.bodyHashFunction(body, this.getSigningKey(tokenSecret));
  }

  /**
   * Base String = Method + Base Url + ParameterString
   * @method getBaseString
   * @param  request       data
   * @param  oauthData     data
   * @return               The base string
   */
  getBaseString(request: RequestOptions, oauthData: Data): string {
    return request.method.toUpperCase()
      + '&' + this.percentEncode(this.getBaseUrl(request.url))
      + '&' + this.percentEncode(this.getParameterString(request, oauthData));
  }

  /**
   * Get data from url
   * -> merge with oauth data
   * -> percent encode key & value
   * -> sort
   * @method getParameterString
   * @param  request            data
   * @param  oauthData          data
   * @return                    The parameter string
   */
  getParameterString(request: RequestOptions, oauthData: Data): string {
    let baseStringData: any;
    if (oauthData.oauth_body_hash) {
      baseStringData = this.sortObject(
        this.percentEncodeData(
          _.merge(oauthData, this.deParamUrl(request.url))
        )
      );
    } else {
      baseStringData = this.sortObject(
        this.percentEncodeData(
          _.merge(oauthData, _.merge(request.data, this.deParamUrl(request.url)))
        )
      );
    }

    let dataStr = '';

    //baseStringData to string
    for (let i = 0; i < baseStringData.length; i++) {
      var key = baseStringData[i].key;
      var value = baseStringData[i].value;
      // check if the value is an array
      // this means that this key has multiple values
      if (value && Array.isArray(value)) {
        // sort the array first
        value.sort();

        var valString = "";
        // serialize all values for this key: e.g. formkey=formvalue1&formkey=formvalue2
        value.forEach(((item: any, i: number) => {
          valString += key + '=' + item;
          if (i < value.length) {
            valString += "&";
          }
        }).bind(this));
        dataStr += valString;
      } else {
        dataStr += key + '=' + value + '&';
      }
    }

    //remove the last character
    dataStr = dataStr.substr(0, dataStr.length - 1);
    return dataStr;
  }

  /**
   * Create a signing key.
   * @method getSigningKey
   * @param  tokenSecret   Secret Token
   * @return               [description]
   */
  getSigningKey(tokenSecret: string | undefined): string {
    tokenSecret = tokenSecret || '';

    if (!this.lastAmpersand && !tokenSecret) {
      return this.percentEncode(this.consumer.secret);
    }

    return this.percentEncode(this.consumer.secret) + '&' + this.percentEncode(tokenSecret);
  }

  /**
   * Return the the URL without its querystring.
   * @method getBaseUrl
   * @param  url        [description]
   * @return            [description]
   */
  getBaseUrl(url: string): string {
    return url.split('?')[0];
  }

  /**
   * Get data from String
   * @method deParam
   * @param  str     The input string
   * @return         The de-paramed result.
   */
  deParam(str: string): Param {
    const arr = str.split('&');
    let data: any = {};

    for (let i = 0; i < arr.length; i++) {
      let item = arr[i].split('=');

      // '' value
      item[1] = item[1] || '';

      // check if the key already exists
      // this can occur if the QS part of the url contains duplicate
      // keys like this: ?formkey=formvalue1&formkey=formvalue2
      if (data[item[0]]) {
        // the key exists already
        if (!Array.isArray(data[item[0]])) {
          // replace the value with an array containing the already present value
          data[item[0]] = [data[item[0]]];
        }
        // and add the new found value to it
        data[item[0]].push(decodeURIComponent(item[1]));
      } else {
        // it doesn't exist, just put the found value in the data object
        data[item[0]] = decodeURIComponent(item[1]);
      }
    }

    return data;
  }

  /**
   * Get data from url
   * @method deParamUrl
   * @param  url        The input url.
   * @return            [description]
   */
  deParamUrl(url: string): Param {
    const tmp = url.split('?');

    if (tmp.length === 1) {
      return {};
    }

    return this.deParam(tmp[1]);
  }

  /**
   * Percent encode string
   * @method percentEncode
   * @param  str           string to be encoded
   * @return               percent encoded string
   */
  percentEncode(str: string): string {
    return encodeURIComponent(str)
      .replace(/\!/g, "%21")
      .replace(/\*/g, "%2A")
      .replace(/\'/g, "%27")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  }

  /**
   * Percent Encode Object
   * @method percentEncodeData
   * @param  data              data
   * @return                   percent encoded data
   */
  private percentEncodeData(data: any): object {
    let result: any = {};

    for (let key in data) {
      let value = data[key];
      // check if the value is an array
      if (value && Array.isArray(value)) {
        let newValue: any[] = [];
        // percentEncode every value
        value.forEach(((val: any) => {
          newValue.push(this.percentEncode(val));
        }).bind(this));
        value = newValue;
      } else {
        value = this.percentEncode(value);
      }
      result[this.percentEncode(key)] = value;
    }

    return result;
  }

  /**
   * Get OAuth data as Header
   * @method toHeader
   * @param  oauthData oAuthData
   * @return           The header object
   */
  toHeader(oauthData: Authorization): Header {
    const sorted = this.sortObject(oauthData);

    let headerValue = 'OAuth ';

    if (this.realm) {
      headerValue += 'realm="' + this.realm + '"' + this.parameterSeparator;
    }

    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].key.indexOf('oauth_') !== 0)
        continue;

      headerValue += this.percentEncode(sorted[i].key) + '="' + this.percentEncode(sorted[i].value as string) + '"' + this.parameterSeparator;
    }

    return {
      Authorization: headerValue.substr(0, headerValue.length - this.parameterSeparator.length) //cut the last chars
    };
  }

  /**
   * Create a random word characters string with input length
   * @method getNonce
   * @return a random word characters string
   */
  getNonce(): string {
    const wordCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < this.nonceLength; i++) {
      result += wordCharacters[Math.random() * wordCharacters.length];
    }

    return result;
  }

  /**
   * Get Current Unix TimeStamp
   * @method getTimeStamp
   * @return current unix timestamp
   */
  getTimeStamp(): number {
    return Date.now();
  }

  /**
   * Sort object by key
   * @method sortObject
   * @param  data       object to be sorted
   * @return            sorted result
   */
  sortObject<O extends { [k: string]: any }, K extends string>(data: O): Array<{ key: keyof O, value: O[K] }> {
    let keys = Object.keys(data);
    let result = [];

    keys.sort();

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      result.push({
        key: key,
        value: data[key],
      });
    }

    return result;
  }

}
