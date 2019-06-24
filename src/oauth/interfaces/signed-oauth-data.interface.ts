import { IOAuthData } from './oauth-data.interface';

/**
 * OAuth data, including the signature.
 */
export interface ISignedOAuthData extends IOAuthData {
  oauth_signature: string;
}
