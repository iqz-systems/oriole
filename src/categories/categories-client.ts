import * as util from 'util';
import { plainToClass } from 'class-transformer';
import { RestClient } from '../rest-client';
import { CategoryAttribute } from './category-attribute';
import { ClientBase } from '../client-base';

export class CategoriesClient extends ClientBase {

  constructor(restClient: RestClient) {
    super(restClient);
  }

  async list(): Promise<CategoryAttribute | CategoryAttribute[]> {
    try {
      const result = await this.restClient.get('/categories');
      return plainToClass(CategoryAttribute, result as CategoryAttribute);
    } catch (error) {
      throw error;
    }
  }

  async create(categoryAttributes: object): Promise<any> {
    return await this.restClient.post('/categories', categoryAttributes);
  }

  async update(categoryId: number, categoryAttributes: object): Promise<any> {
    const endpointUrl = util.format('/categories/%d', categoryId);
    return await this.restClient.put(endpointUrl, categoryAttributes);
  }

  async delete(categoryId: number): Promise<any> {
    const endpointUrl = util.format('/categories/%d', categoryId);
    return await this.restClient.delete(endpointUrl);
  }
}
