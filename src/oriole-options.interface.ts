export interface IOrioleOptions {
  /**
   * The Magento 2 instance URL. Should end with '/rest'
   */
  url: string;
  /**
   * The store ID to target within the Magento 2 instance. Will use a default
   * store ID of 'default' if not specified.
   */
  storeId?: string;
  /**
   * The OAuth credentials to integrate the REST client.
   * Must be specified if 'bearer' option is not specified.
   */
  oauth?: {
    /**
     * The OAuth consumer key.
     */
    consumerKey: string;
    /**
     * The OAuth consumer secret.
     */
    consumerSecret: string;
    /**
     * The OAuth access token.
     */
    accessToken: string;
    /**
     * The OAuth access token secret.
     */
    accessTokenSecret: string;
  },
  /**
   * The bearer token credentials to integrated the REST client.
   * Must be specified if 'oauth' option is not specified.
   */
  bearer?: {
    /**
     * The bearer token.
     */
    token: string;
  }
}
