import * as util from 'util';
import { plainToClass } from 'class-transformer';
import { RestClient } from '../rest-client';
import { ClientBase } from '../client-base';
import { SearchCriteria, SearchSortOrder, ListResult } from '../common-models';
import { Customer } from './models';

export class CustomersClient extends ClientBase {

  constructor(restClient: RestClient) {
    super(restClient);
  }

  /**
   * Returns the current customer information. The request has to be made with a customer token.
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
   * Gets a list of all customers.
   * @method list
   * @return An array of customers.
   */
  async list(): Promise<ListResult<Customer>> {
    const searchCriteria = new SearchCriteria();
    searchCriteria.addSearchSortOrder(new SearchSortOrder('email', 'ASC'));

    const query = `${searchCriteria.toString()}`;
    const endpointUrl = util.format('/customers/search?%s', query);

    try {
      const result = await this.restClient.get(endpointUrl);
      return new ListResult<Customer>(result, plainToClass(Customer, result.items as Customer[]));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets complete information about a customer identified by its id.
   * @method get
   * @param  customerId The id of the customer to fetch the info about.
   * @return            A Customer object.
   */
  async get(customerId: number): Promise<any> {
    try {
      const result = await this.restClient.get(`/customers/${customerId}`);
      return plainToClass(Customer, result as Customer);
    } catch (error) {
      throw error;
    }
  }

}
