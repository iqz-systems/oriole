/**
 * Use this file to try out the library.
 * Invoke it like `npm run demo`.
 * Make sure to update the credentials before doing so. :)
 */

import 'reflect-metadata';

import { Oriole } from './oriole';
import { SearchCriteria } from './common-models';
// import { CategoryListResult } from './categories';

const o = new Oriole({
  oauth: {
    consumerKey: '<your-consumer-key>',
    consumerSecret: '<your-consumer-secret>',
    accessToken: '<your-access-token>',
    accessTokenSecret: '<your-access-token-secret>'
  },
  url: 'http://localhost:8080/rest'
});

async function display() {
  try {
    const searchCriteria = new SearchCriteria();
    searchCriteria.addSearchByNameOrSkuCriteria('pineapple');
    const result = await o.products.search(searchCriteria);
    console.log(result);
    console.log(JSON.stringify(result));
    console.log();

    // const cat = await o.categories.list();
    // console.log(cat);
    // console.log(JSON.stringify(cat));
    // console.log();

    // let catList;
    // if (Array.isArray(cat)) {
    //   catList = CategoryListResult.flattenCategoryListResults(cat);
    // } else {
    //   catList = CategoryListResult.flattenCategoryListResults([cat]);
    // }
    // console.log(catList);
    // console.log(JSON.stringify(catList));

    // const specificCat = await o.categories.get(10);
    // console.log(specificCat);
    // console.log(JSON.stringify(specificCat));
    // console.log();
    //
    // const rootCat = await o.categories.get(2);
    // console.log(rootCat);
    // console.log(JSON.stringify(rootCat));
    // console.log();
  } catch (error) {
    console.error(error);
  }
}

display();
