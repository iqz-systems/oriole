import { RestClient } from './rest-client';
import { ProductsClient, ProductAttributePropertiesClient } from './products';
import { CategoriesClient } from './categories';

export class Oriole {

  static readonly MAGENTO_API_VERSION: string = 'V1';

  private client: RestClient;

  products: ProductsClient;
  productAttributes: ProductAttributePropertiesClient;
  categories: CategoriesClient;

  constructor(options: IOrioleOptions) {
    this.client = new RestClient({
      url: options.url,
      apiVersion: Oriole.MAGENTO_API_VERSION,
      storeId: options.storeId ? options.storeId : 'default',
      oauth: options.oauth,
      bearer: options.bearer
    });

    this.products = new ProductsClient(this.client);
    this.productAttributes = new ProductAttributePropertiesClient(this.client);
    this.categories = new CategoriesClient(this.client);
  }
}

export interface IOrioleOptions {
  url: string;
  storeId?: string;
  oauth?: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  },
  bearer?: {
    token: string;
  }
}
