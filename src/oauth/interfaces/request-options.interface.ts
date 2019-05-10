/**
 * Request options.
 */
export interface IRequestOptions {
  url: string;
  method: string;
  data?: any;
  includeBodyHash?: boolean;
}
