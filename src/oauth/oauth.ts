import { Consumer } from './consumer.interface';
import { Options } from './options.interface';
import { RequestOptions } from './request-options.interface';
import { Token } from './token.interface';
import { Authorization } from './authorization.interface';
import { Data } from './data.interface';
import { Header } from './header.interface';

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
    let baseStringData;
    if (oauthData.oauth_body_hash) {
      baseStringData = this.sortObject(this.percentEncodeData(this.mergeObject(oauthData, this.deParamUrl(request.url))));
    } else {
      baseStringData = this.sortObject(this.percentEncodeData(this.mergeObject(oauthData, this.mergeObject(request.data, this.deParamUrl(request.url)))));
    }

    let dataStr = '';

    //base_string_data to string
    for (let i = 0; i < baseStringData.length; i++) {
      var key = base_string_data[i].key;
      var value = base_string_data[i].value;
      // check if the value is an array
      // this means that this key has multiple values
      if (value && Array.isArray(value)) {
        // sort the array first
        value.sort();

        var valString = "";
        // serialize all values for this key: e.g. formkey=formvalue1&formkey=formvalue2
        value.forEach((function(item, i) {
          valString += key + '=' + item;
          if (i < value.length) {
            valString += "&";
          }
        }).bind(this));
        data_str += valString;
      } else {
        data_str += key + '=' + value + '&';
      }
    }
  }

  /**
   * Generate the signing key.
   *
   * Key = "<Consumer Key>&<Token Key or an empty string>"
   */
  getSigningKey(token_secret: string | undefined): string { }

  /**
   * Return the the URL without its querystring.
   */
  getBaseUrl(url: string): string { }

  /**
   * Parse querystring / form data.
   */
  deParam(str: string): Param { }

  /**
   * Parse querystring from an url
   */
  deParamUrl(url: string): Param { }

  /**
   * Form data encoding.
   */
  percentEncode(str: string): string { }

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
