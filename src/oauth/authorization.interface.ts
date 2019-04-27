import { Data } from './data.interface';

/**
 * OAuth data, including the signature.
 */
export interface Authorization extends Data {
  oauth_signature: string
}
