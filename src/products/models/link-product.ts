import { Type } from 'class-transformer';
import { ExtensionAttributes } from '../../common-models';


export class LinkProduct{

  sku: string = '';
  link_type: string = '';
  linked_product_sku: string = '';
  linked_product_type: string = '';
  position: string = '';

  @Type(() => ExtensionAttributes)
  extension_attributes: ExtensionAttributes[] = [];
}