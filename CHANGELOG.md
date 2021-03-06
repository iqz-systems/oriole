# Change log

- [Change log](#change-log)
    - [0.14.0](#0140)
    - [0.13.0](#0130)
    - [0.12.0](#0120)
    - [0.11.0](#0110)
      - [0.10.1](#0101)
    - [0.10.0](#0100)
    - [0.9.0](#090)
      - [0.8.1](#081)
    - [0.8.0 Breaking Changes](#080-breaking-changes)
    - [0.7.0](#070)
      - [0.6.1](#061)
    - [0.6.0](#060)
      - [0.5.3](#053)
      - [0.5.2](#052)
      - [0.5.1](#051)
    - [0.5.0](#050)
      - [0.4.2](#042)
      - [0.4.1](#041)
    - [0.4.0](#040)
      - [0.3.1](#031)
    - [0.3.0](#030)

### 0.14.0

- Bumped versions for dependencies.

### 0.13.0

- Updated `axios` to latest version (`0.19.0`).

### 0.12.0

- Moved `Customer` model into its own client.
- Added sort conditions into `SearchCriteria`.
- Added `CustomersClient`.

### 0.11.0

- Fixed bug in `RestClient` which prevented token based authentication from working correctly.
- Added functionality to get information about a currently signed in customer.

#### 0.10.1

- Updated package versions.

### 0.10.0

- Added methods to fetch the customer token and admin token via API.

### 0.9.0

- Updated API to more reliably expose stock details in products.

#### 0.8.1

- Renamed models in products module to be more consistent with the rest of the package.

### 0.8.0 Breaking Changes

- Renamed models in orders module to be more consistent with the rest of the package.

### 0.7.0

- Added helper method for orders.
- Added methods to search orders.
- Added ability to query for linked products for a product.

#### 0.6.1

- Added missing `ExtensionAttributes` and helper methods for stock querying.

### 0.6.0

- Added `orders` client. Now you can fetch order details.

#### 0.5.3

- Added product fetching by SKU.

#### 0.5.2

- Improved typing for `ListResult` model.
- Added searching for categories.

#### 0.5.1

- Added `listByCategory(categoryId)` to products client.

### 0.5.0

- Added `getProducts(categoryId)` to categories client.

#### 0.4.2

- Fixed bug in `CategoryListResult.flattenCategoryListResults()` which caused it to return empty array always.

#### 0.4.1

- Exported models of product module.

### 0.4.0

- Added convenience methods to models.
- Renamed `ProductAttributePropertyOption`, `ProductAttributeProperties` and `ProductAttribute` to `ProductAttributeOption`, `ProductAttributes` and `Product` respectively. It now makes more sense and avoids confusing names.
- Renamed `CategoryAttribute` to `CategoryListResult` and added `Category` model.

#### 0.3.1

- Reverted 'Made all properties of `ProductAttribute` optional.'

### 0.3.0

- Made all properties of `ProductAttribute` optional.
- Updated the `list()` method of `ProductsClient` to change the method parameter.
- Added `search()` method in `ProductsClient`. You can now specify fine search criteria to search for products.
