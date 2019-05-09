# Changelog

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
