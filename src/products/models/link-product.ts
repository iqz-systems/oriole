import { Type } from 'class-transformer';
import { ExtensionAttribute } from '../../common-models';


export class LinkedProduct{

  sku: string = '';
  link_type?: LinkType;
  linked_product_sku: string = '';
  linked_product_type: string = '';
  position: string = '';

  @Type(() => ExtensionAttribute)
  extension_attributes: ExtensionAttribute[] = [];
}

export type LinkType = 'crosssell'|'upsell'|'related'|'associated';