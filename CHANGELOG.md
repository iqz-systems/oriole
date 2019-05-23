# Change log

### 0.8.0 Breaking Changes

-   Renamed models in orders module to be more consistent with the rest of the package.

### 0.7.0

-   Added helper method for orders.
-   Added methods to search orders.
-   Added ability to query for linked products for a product.

#### 0.6.1

-   Added missing `ExtensionAttributes` and helper methods for stock querying.

### 0.6.0

-   Added `orders` client. Now you can fetch order details.

#### 0.5.3

-   Added product fetching by SKU.

#### 0.5.2

-   Improved typing for `ListResult` model.
-   Added searching for categories.

#### 0.5.1

-   Added `listByCategory(categoryId)` to products client.

### 0.5.0

-   Added `getProducts(categoryId)` to categories client.

#### 0.4.2

-   Fixed bug in `CategoryListResult.flattenCategoryListResults()` which caused it to return empty array always.

#### 0.4.1

-   Exported models of product module.

### 0.4.0

-   Added convenience methods to models.
-   Renamed `ProductAttributePropertyOption`, `ProductAttributeProperties` and `ProductAttribute` to `ProductAttributeOption`, `ProductAttributes` and `Product` respectively. It now makes more sense and avoids confusing names.
-   Renamed `CategoryAttribute` to `CategoryListResult` and added `Category` model.

#### 0.3.1

-   Reverted 'Made all properties of `ProductAttribute` optional.'

### 0.3.0

-   Made all properties of `ProductAttribute` optional.
-   Updated the `list()` method of `ProductsClient` to change the method parameter.
-   Added `search()` method in `ProductsClient`. You can now specify fine search criteria to search for products.
