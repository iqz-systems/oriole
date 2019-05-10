import * as util from 'util';
import { RestClient } from '../rest-client';
import { plainToClass } from 'class-transformer';
import { ListResult, SearchCriteria } from '../common-models';
import { ClientBase } from '../client-base';
import { Product } from './models';
import { LinkProduct } from './models/link-product';

export class ProductsClient extends ClientBase {

  constructor(restClient: RestClient) {
    super(restClient);
  }

  /**
   * List all products in Magento store.
   * @method list
   * @param  pageSize    The number of results to be fetched in one "page" of API response. Default is 9999.
   * @param  currentPage The current page of the "pages" of result. Use in conjunction with pageSize.
   * @return             A list of products.
   */
  async list(pageSize: number = 9999, currentPage: number = 1): Promise<ListResult<Product>> {
    const query = `searchCriteria[pageSize]=${pageSize}&searchCriteria[currentPage]=${currentPage}`;
    const endpointUrl = util.format('/products?%s', query);
    try {
      const result = await this.restClient.get(endpointUrl);
      return new ListResult<Product>(result, plainToClass(Product, result.items as Product[]));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search for products in Magento store.
   * @method search
   * @param  searchCriteria Search criteria describing what you need to search.
   * @param  pageSize       The number of results to be fetched in one "page" of API response. Default is 9999.
   * @param  currentPage    The current page of the "pages" of result. Use in conjunction with pageSize.
   * @return                A list of products based on search criteria.
   */
  async search(searchCriteria: SearchCriteria, pageSize: number = 9999, currentPage: number = 1): Promise<ListResult<Product>> {
    const query = `searchCriteria[pageSize]=${pageSize}&searchCriteria[currentPage]=${currentPage}`
      + `&${searchCriteria.toString()}`;
    const endpointUrl = util.format('/products?%s', query);
    try {
      const result = await this.restClient.get(endpointUrl);
      return new ListResult<Product>(result, plainToClass(Product, result.items as Product[]));
    } catch (error) {
      throw error;
    }
  }

  /**
   * list all related products in Magento store.
   * @method list
   * @param  productSku     Product SKU value
   * @return                A list of related products.
   */
  async relatedProducts(productSku: string) {
    return await this.listByLinkType('related',productSku);
  }

  /**
   * list all crosssell products in Magento store.
   * @method list
   * @param  productSku     Product SKU value
   * @return                A list of crosssell products.
   */
  async crosssellProducts(productSku: string) {
    return await this.listByLinkType('crosssell',productSku);
  }

  /**
   * list all upsell products in Magento store.
   * @method list
   * @param  productSku     Product SKU value
   * @return                A list of related products.
   */
  async upsellProducts(productSku: string) {
    return await this.listByLinkType('upsell',productSku);
  }

  /**
   * list all associated products in Magento store.
   * @method list
   * @param  productSku     Product SKU value
   * @return                A list of associated products.
   */
  async associatedProducts(productSku: string) {
    return await this.listByLinkType('associated',productSku);
  }

  /**
   * list all Link products in Magento store.
   * @method list
   * @param  linkType       Link Type [linkType, crosssell, upsell, associated]
   * @param  productSku     Product SKU value
   * @return                A list of Link products.
   */
  listByLinkType(linkType:String, productSku: string): Promise<ListResult<LinkProduct>> {
    const query = `${productSku}/links/${linkType}`;
    const endpointUrl = util.format('/products/%s', query);
    try {
      return this.restClient.get(endpointUrl);
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
