import { ClientBase } from '../client-base';
import { RestClient } from '../rest-client';
import { Customer } from './models';
import { plainToClass } from 'class-transformer';

export class IntegrationClient extends ClientBase {

  constructor(restClient: RestClient) {
    super(restClient);
  }

  /**
   * Returns the customer information. The request has to be made with a customer token.
   */
  async getCustomerInfo(): Promise<Customer> {
    try {
      const result = await this.restClient.get('/customers/me');
      return plainToClass(Customer, result);
    } catch (error) {
      throw error;
    }
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
