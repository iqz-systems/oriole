import { ITokenPair } from './token-pair.interface';

/**
 * OAuth options.
 */
export interface IOAuthOptions {
  /**
   * Method used to generate the body hash.
   *
   * Note: the key is used for implementation HMAC algorithms for the body hash,
   * but typically it should return SHA1 hash of base_string.
   */
  bodyHashFunction?: (base_string: string, key: string) => string;
  consumer: ITokenPair;
  /**
   * Method used to hash the the OAuth and form/querystring data.
   */
  hashFunction?: (base_string: string, key: string) => string;
  lastAmpersand?: boolean;
  nonceLength?: number;
  parameterSeparator?: string;
  realm?: string;
  signatureMethod?: string;
  version?: string;
}
