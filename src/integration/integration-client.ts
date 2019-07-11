import { ClientBase } from '../client-base';
import { RestClient } from '../rest-client';

export class IntegrationClient extends ClientBase {

  constructor(restClient: RestClient) {
    super(restClient);
  }

  /**
   * Gets a customer auth token which you can use to send customer specific requests.
   * @param username The username (email) of the customer.
   * @param password The password of the customer.
   */
  async getCustomerToken(username: string, password: string): Promise<string> {
    try {
      const result = await this.restClient.post('/integration/customer/token', {
        username,
        password,
      }) as string;
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets a admin auth token which you can use to send admin requests.
   * @param username The username of the admin.
   * @param password The password of the admin.
   */
  async getAdminToken(username: string, password: string): Promise<string> {
    try {
      const result = await this.restClient.post('/integration/admin/token', {
        username,
        password,
      }) as string;
      return result;
    } catch (error) {
      throw error;
    }
  }
}
