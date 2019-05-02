import * as _ from 'lodash';
import { Consumer } from './consumer.interface';
import { Options } from './options.interface';
import { RequestOptions } from './request-options.interface';
import { Token } from './token.interface';
import { Authorization } from './authorization.interface';
import { Data } from './data.interface';
import { Param } from './param.interface';
import { AuthorizationHeader } from './authorization-header';

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
    this.nonceLength = opts.nonceLength || 32;
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
    const oAuthData: Data = {
      oauth_consumer_key: this.consumer.key,
      oauth_nonce: this.getNonce(),
      oauth_signature_method: this.signatureMethod,
      oauth_timestamp: this.getTimeStamp(),
      oauth_version: this.version
    };

    if (token.key !== undefined) {
      oAuthData.oauth_token = token.key;
    }

    if (!request.data) {
      request.data = {};
    }

    if (request.includeBodyHash) {
      oAuthData.oauth_body_hash = this.getBodyHash(request, token.secret);
    }

    const oAuthSignature = this.getSignature(request, token.secret, oAuthData);

    return _.merge(oAuthData, { oauth_signature: oAuthSignature });
  }

  /**
   * Create a OAuth Signature
   * @method getSignature
   * @param  request      data
   * @param  tokenSecret  key and secret token
   * @param  oAuthData    OAuth data
   * @return              The signature
   */
  private getSignature(request: RequestOptions, tokenSecret: string | undefined, oAuthData: Data): string {
    const baseString = this.getBaseString(request, oAuthData);
    const signingKey = this.getSigningKey(tokenSecret);
    return this.hashFunction(baseString, signingKey);
  }

  /**
   * Create a OAuth Body Hash
   * @method getBodyHash
   * @param  request      data
   * @param  tokenSecret  key and secret token
   * @return              The body hash
   */
  private getBodyHash(request: RequestOptions, tokenSecret: string | undefined): string {
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
   * @param  oAuthData     data
   * @return               The base string
   */
  private getBaseString(request: RequestOptions, oAuthData: Data): string {
    return request.method.toUpperCase()
      + '&' + this.percentEncode(this.getBaseUrl(request.url))
      + '&' + this.percentEncode(this.getParameterString(request, oAuthData));
  }

  /**
   * Get data from url
   * -> merge with oAuth data
   * -> percent encode key & value
   * -> sort
   * @method getParameterString
   * @param  request            data
   * @param  oAuthData          data
   * @return                    The parameter string
   */
  private getParameterString(request: RequestOptions, oAuthData: Data): string {
    let baseStringData: any;
    if (oAuthData.oauth_body_hash) {
      baseStringData = this.sortObject(
        this.percentEncodeData(
          _.merge(oAuthData, this.deParamUrl(request.url))
        )
      );
    } else {
      baseStringData = this.sortObject(
        this.percentEncodeData(
          _.merge(oAuthData, _.merge(request.data, this.deParamUrl(request.url)))
        )
      );
    }

    let dataStr = '';

    //baseStringData to string
    for (let i = 0; i < baseStringData.length; i++) {
      let key = baseStringData[i].key;
      let value = baseStringData[i].value;
      // check if the value is an array
      // this means that this key has multiple values
      if (value && Array.isArray(value)) {
        // sort the array first
        value.sort();

        let valString = "";
        // serialize all values for this key: e.g. formkey=formvalue1&formkey=formvalue2
        value.forEach(((item: any, i: number) => {
          valString += key + '=' + item;
          if (i < value.length) {
            valString += "&";
          }
        }));
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
  private getSigningKey(tokenSecret: string | undefined): string {
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
  private getBaseUrl(url: string): string {
    return url.split('?')[0];
  }

  /**
   * Get data from String
   * @method deParam
   * @param  str     The input string
   * @return         The de-paramed result.
   */
  private deParam(str: string): Param {
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
  private deParamUrl(url: string): Param {
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
  private percentEncode(str: string): string {
    const result = encodeURIComponent(str)
      .replace(/\!/g, "%21")
      .replace(/\*/g, "%2A")
      .replace(/\'/g, "%27")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
    return result;
  }

  /**
   * Percent Encode Object
   * @method percentEncodeData
   * @param  data              data
   * @return                   percent encoded data
   */
  private percentEncodeData(data: Data): { [prop: string]: string | string[] } {
    let result: { [prop: string]: string | string[] } = {};

    for (let key in data) {
      let value = data[key];
      // check if the value is an array
      if (value && Array.isArray(value)) {
        let newValue: string[] = [];
        // percentEncode every value
        for (let val of value) {
          newValue.push(this.percentEncode(val));
        }
        value = newValue;
      } else {
        value = this.percentEncode(value as string);
      }
      result[this.percentEncode(key)] = value;
    }

    return result;
  }

  /**
   * Get OAuth data as Header
   * @method toHeader
   * @param  oAuthData oAuthData
   * @return           The header object
   */
  /**
   * Get oAuth data as header
   * @method toHeader
   * @param  oAuthData The current oAuth data
   * @return           An Authorization header object of the current oAuth data.
   */
  toHeader(oAuthData: Authorization): AuthorizationHeader {
    const sorted = this.sortObject(oAuthData);

    let headerValue = 'OAuth ';

    if (this.realm) {
      headerValue += 'realm="' + this.realm + '"' + this.parameterSeparator;
    }

    for (let i = 0; i < sorted.length; i++) {
      if ((sorted[i].key as string).indexOf('oauth_') !== 0)
        continue;

      headerValue += this.percentEncode(sorted[i].key as string) + '="' + this.percentEncode(sorted[i].value as string) + '"' + this.parameterSeparator;
    }

    return new AuthorizationHeader(headerValue.substr(0, headerValue.length - this.parameterSeparator.length)); // cut the last chars
  }

  /**
   * Create a random word characters string with input length
   * @method getNonce
   * @return a random word characters string
   */
  private getNonce(): string {
    const wordCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < this.nonceLength; i++) {
      const random = parseInt((Math.random() * wordCharacters.length) + '', 10);
      result += wordCharacters[random];
    }

    return result;
  }

  /**
   * Get Current Unix TimeStamp
   * @method getTimeStamp
   * @return current unix timestamp
   */
  private getTimeStamp(): number {
    return parseInt((new Date().getTime() / 1000) + '', 10);
  }

  /**
   * Sort object by key
   * @method sortObject
   * @param  data       object to be sorted
   * @return            sorted result
   */
  private sortObject<O extends { [k: string]: any }, K extends string>(data: O): Array<{ key: keyof O, value: O[K] }> {
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
