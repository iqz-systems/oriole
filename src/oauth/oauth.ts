import * as _ from 'lodash';
import * as qs from 'querystring';
import { IOAuthOptions } from './oauth-options.interface';
import { IRequestOptions } from './request-options.interface';
import { AuthorizationHeader } from './authorization-header';
import { Helpers } from './helpers';
import { IParamMap } from './param-map.interface';
import { ITokenPair } from './token-pair.interface';
import { IOAuthData } from './oauth-data.interface';
import { ISignedOAuthData } from './signed-oauth-data.interface';

export class OAuth {
  consumer: ITokenPair;
  lastAmpersand: boolean;
  nonceLength: number;
  parameterSeparator: string;
  realm?: string;
  signatureMethod: string;
  version: string;

  hashFunction: (baseString: string, key: string) => string;
  bodyHashFunction: (baseString: string, key: string) => string;

  constructor(opts: IOAuthOptions) {
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
  authorize(request: IRequestOptions, token: ITokenPair): ISignedOAuthData {
    const oAuthData: IOAuthData = {
      oauth_consumer_key: this.consumer.key,
      oauth_nonce: this.getNonce(),
      oauth_signature_method: this.signatureMethod,
      oauth_timestamp: Helpers.getTimeStamp(),
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
  private getSignature(request: IRequestOptions, tokenSecret: string | undefined, oAuthData: IOAuthData): string {
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
  private getBodyHash(request: IRequestOptions, tokenSecret: string | undefined): string {
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
  private getBaseString(request: IRequestOptions, oAuthData: IOAuthData): string {
    return request.method.toUpperCase()
      + '&' + Helpers.percentEncode(Helpers.getBaseUrl(request.url))
      + '&' + Helpers.percentEncode(this.getParameterString(request, oAuthData));
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
  private getParameterString(request: IRequestOptions, oAuthData: IOAuthData): string {
    let baseStringData: any;
    if (oAuthData.oauth_body_hash) {
      baseStringData = Helpers.sortObject(
        this.percentEncodeData(
          _.merge(oAuthData, this.deParamUrl(request.url))
        )
      );
    } else {
      baseStringData = Helpers.sortObject(
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
   * @param  tokenSecret   Secret TokenPair
   * @return               [description]
   */
  private getSigningKey(tokenSecret: string | undefined): string {
    tokenSecret = tokenSecret || '';

    if (!this.lastAmpersand && !tokenSecret) {
      return Helpers.percentEncode(this.consumer.secret);
    }

    return Helpers.percentEncode(this.consumer.secret) + '&' + Helpers.percentEncode(tokenSecret);
  }

  /**
   * Get data from url
   * @method deParamUrl
   * @param  url        The input url.
   * @return            [description]
   */
  private deParamUrl(url: string): IParamMap {
    const tmp = url.split('?');

    if (tmp.length === 1) {
      return {};
    }

    return qs.parse(tmp[1]);
  }

  /**
   * Percent Encode Object
   * @method percentEncodeData
   * @param  data              data
   * @return                   percent encoded data
   */
  private percentEncodeData(data: IOAuthData): { [prop: string]: string | string[] } {
    let result: { [prop: string]: string | string[] } = {};

    for (let key in data) {
      let value = data[key];
      // check if the value is an array
      if (value && Array.isArray(value)) {
        let newValue: string[] = [];
        // percentEncode every value
        for (let val of value) {
          newValue.push(Helpers.percentEncode(val));
        }
        value = newValue;
      } else {
        value = Helpers.percentEncode(value as string);
      }
      result[Helpers.percentEncode(key)] = value;
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
  toHeader(oAuthData: ISignedOAuthData): AuthorizationHeader {
    const sorted = Helpers.sortObject(oAuthData);

    let headerValue = 'OAuth ';

    if (this.realm) {
      headerValue += 'realm="' + this.realm + '"' + this.parameterSeparator;
    }

    for (let i = 0; i < sorted.length; i++) {
      if ((sorted[i].key as string).indexOf('oauth_') !== 0)
        continue;

      headerValue += Helpers.percentEncode(sorted[i].key as string) + '="' + Helpers.percentEncode(sorted[i].value as string) + '"' + this.parameterSeparator;
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
}
