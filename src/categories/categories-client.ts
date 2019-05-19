import * as util from 'util';
import { plainToClass } from 'class-transformer';
import { RestClient } from '../rest-client';
import { ClientBase } from '../client-base';
import { CategoryListResult, Category, CategoryProduct } from './models';

export class CategoriesClient extends ClientBase {

  constructor(restClient: RestClient) {
    super(restClient);
  }

  /**
   * Gets a list of all categories with a minimal information set.
   * @method list
   * @return An array (or single item) of categories.
   */
  async list(): Promise<CategoryListResult | CategoryListResult[]> {
    try {
      const result = await this.restClient.get('/categories');
      return plainToClass(CategoryListResult, result as CategoryListResult);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets complete information about a category identified by its id.
   * @method get
   * @param  categoryId The id of the category to fetch the info about.
   * @return            A Category object with the complete info about a category.
   */
  async get(categoryId: number): Promise<Category> {
    try {
      const result = await this.restClient.get(`/categories/${categoryId}`);
      return plainToClass(Category, result as Category);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Returns a list of all product SKUs in a given category.
   * @method getProducts
   * @param  categoryId  The category ID of which the products should be fetched.
   * @return             A list of product SKUs associated with the category.
   */
  async getProducts(categoryId: number): Promise<CategoryProduct[]> {
    try {
      const result = await this.restClient.get(`/categories/${categoryId}/products`);
      return plainToClass(CategoryProduct, result as CategoryProduct[]);
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
