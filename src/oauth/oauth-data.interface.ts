/**
 * OAuth data, excluding the signature.
 */
export interface IOAuthData {
  [key: string]: string | string[] | number | undefined;
  oauth_consumer_key: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: number;
  oauth_version: string;
  oauth_token?: string;
  oauth_body_hash?: string;
}
