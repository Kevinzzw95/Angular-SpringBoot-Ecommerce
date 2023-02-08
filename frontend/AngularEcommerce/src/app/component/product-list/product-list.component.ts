import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {containingDirPath} from "@angular/compiler-cli/ngcc";
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: string = '1';
  searchMode: boolean = false
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousCategoryId: string = '1';
  previousKeyword: string = '';

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    //this.listProducts();
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      this.currentCategoryId = this.route.snapshot.paramMap.get('id')!;
    }
    else {
      this.currentCategoryId = '1';
    }

    // Check if the category has changed, if not, reuse it
    // if changed, set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPagination(this.thePageNumber - 1,
                                                         this.thePageSize,
                                                         this.currentCategoryId).subscribe(this.processResult());
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if(this.previousKeyword != keyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = keyword;

    this.productService.searchProductsPagination(this.thePageNumber - 1,
      this.thePageSize, keyword).subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    // covert string to number
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements =  data.page.totalElements;
    }
  }

  /*---------Cart----------*/
  addToCart(theProduct: Product) {
    console.log(theProduct.name);

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }

}
