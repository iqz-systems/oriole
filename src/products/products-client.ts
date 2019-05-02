import * as util from 'util';
import { RestClient } from '../rest-client';
import { plainToClass } from 'class-transformer';
import { ProductAttribute } from './product-attribute';
import { ListResult } from '../common-models';
import { ClientBase } from '../client-base';

export class ProductsClient extends ClientBase {

  constructor(restClient: RestClient) {
    super(restClient);
  }

  async list(searchCriteria: string): Promise<ListResult<ProductAttribute>> {
    const query = 'searchCriteria=' + searchCriteria;
    const endpointUrl = util.format('/products?%s', query);
    try {
      const result = await this.restClient.get(endpointUrl);
      return new ListResult<ProductAttribute>(result, plainToClass(ProductAttribute, result.items as ProductAttribute[]));
    } catch (error) {
      throw error;
    }
  }

  async create(productAttributes: object): Promise<any> {
    return await this.restClient.post('/products', productAttributes);
  }

  async update(productSku: string, productAttributes: object): Promise<any> {
    const endpointUrl = util.format('/products/%s', productSku);
    return await this.restClient.put(endpointUrl, productAttributes);
  }

  async delete(productSku: string): Promise<any> {
    const endpointUrl = util.format('/products/%s', productSku);
    return this.restClient.delete(endpointUrl);
  }
}
