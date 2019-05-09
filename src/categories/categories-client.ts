import * as util from 'util';
import { plainToClass } from 'class-transformer';
import { RestClient } from '../rest-client';
import { ClientBase } from '../client-base';
import { CategoryListResult, Category } from './models';

export class CategoriesClient extends ClientBase {

  constructor(restClient: RestClient) {
    super(restClient);
  }

  async list(): Promise<CategoryListResult | CategoryListResult[]> {
    try {
      const result = await this.restClient.get('/categories');
      return plainToClass(CategoryListResult, result as CategoryListResult);
    } catch (error) {
      throw error;
    }
  }

  async get(categoryId: number): Promise<Category> {
    try {
      const result = await this.restClient.get(`/categories/${categoryId}`);
      return plainToClass(Category, result as Category);
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
