import * as util from 'util';
import { RestClient } from '../rest-client';
import { ClientBase } from '../client-base';
import { Orders } from './models';
import { plainToClass } from 'class-transformer';
import { ListResult } from '../common-models';

export class OrdersClient extends ClientBase {

  constructor(restClient: RestClient) {
    super(restClient);
  }

  /**
   * List all orders in Magento store.
   * @method list
   * @param  pageSize    The number of results to be fetched in one "page" of API response. Default is 9999.
   * @param  currentPage The current page of the "pages" of result. Use in conjunction with pageSize.
   * @return             A list of orders.
   */
  async list(pageSize: number = 9999, currentPage: number = 1): Promise<ListResult<Orders>> {
    const query = `searchCriteria[pageSize]=${pageSize}&searchCriteria[currentPage]=${currentPage}`;
    const endpointUrl = util.format('/orders?%s', query);
    try {
      const result = await this.restClient.get(endpointUrl);
      return new ListResult<Orders>(result, plainToClass(Orders, result.items as Orders[]));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get order details by orderId in Magento store.
   * @method get
   * @param  orderId    The Id to be fetched from the order.
   * @return            Order details.
   */
  async get(orderId: number): Promise<Orders> {
    const endpointUrl = util.format(`/orders/${orderId}`);
    try {
      const result = await this.restClient.get(endpointUrl);
      return plainToClass(Orders, result as Orders);
    } catch (error) {
      throw error;
    }
  }

}
