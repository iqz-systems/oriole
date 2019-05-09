import * as util from 'util';
import { plainToClass } from 'class-transformer';
import { ClientBase } from '../client-base';
import { RestClient } from '../rest-client';
import { ListResult } from '../common-models';
import { ProductAttributes } from './models';

export class ProductAttributesClient extends ClientBase {

  constructor(restClient: RestClient) {
    super(restClient);
  }

  async list(searchCriteria: string): Promise<ListResult<ProductAttributes>> {
    const query = 'searchCriteria=' + searchCriteria;
    const endpointUrl = util.format('/products/attributes?%s', query);
    try {
      const result = await this.restClient.get(endpointUrl);
      return new ListResult<ProductAttributes>(result, plainToClass(ProductAttributes, result.items as ProductAttributes[]));
    } catch (error) {
      throw error;
    }
  }

  async get(attributeCode: string): Promise<ProductAttributes> {
    const endpointUrl = util.format('/products/attributes/%s', attributeCode);
    try {
      const result = await this.restClient.get(endpointUrl);
      return plainToClass(ProductAttributes, result as ProductAttributes);
    } catch (error) {
      throw error;
    }
  }

  async create(attributeAttributes: object): Promise<any> {
    return await this.restClient.post('/products/attributes', attributeAttributes);
  }

  async update(attributeCode: string, attributeAttributes: object): Promise<any> {
    const endpointUrl = util.format('/products/attributes/%s', attributeCode);
    return await this.restClient.put(endpointUrl, attributeAttributes);
  }

  async delete(attributeCode: string): Promise<any> {
    const endpointUrl = util.format('/products/attributes/%s', attributeCode);
    return await this.restClient.delete(endpointUrl);
  }
}
