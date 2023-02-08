import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";
import {ProductCategory} from "../common/product-category";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.luv2shopApiUrl_products + '/products';
  private categoryUrl = environment.luv2shopApiUrl_products + '/product-category'

  constructor(private httpClient: HttpClient) { }

  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductListPagination(thePage: number,
                           thePageSize: number,
                           theCategoryId: string): Observable<GetResponseProduct> {

    const searchUrl = `${ this.baseUrl }/search/findByCategoryId?id=${ theCategoryId }`
                      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductList(theCategoryId: string): Observable<Product[]> {

    const searchUrl = `${ this.baseUrl }/search/findByCategoryId?id=${ theCategoryId }`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategories)
    );
  }

  searchProducts(keyword: string): Observable<Product[]> {

    const searchUrl = `${ this.baseUrl }/search/findByNameContaining?name=${ keyword }`;

    return this.getProducts(searchUrl);
  }

  searchProductsPagination(thePage: number,
                          thePageSize: number,
                          theKeyword: string): Observable<GetResponseProduct> {

    const searchUrl = `${ this.baseUrl }/search/findByNameContaining?name=${ theKeyword }`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProduct(id: string): Observable<Product> {

    const searchUrl = `${ this.baseUrl }/${ id }`;

    return this.httpClient.get<Product>(searchUrl);
  }

}

// the key must be exactly the same as the response JSON file!!!
interface GetResponseProduct {
  _embedded: {
    products: Product[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategories: ProductCategory[];
  }
}


