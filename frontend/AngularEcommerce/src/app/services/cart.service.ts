import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() {

    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null) {
      this.cartItems = data;

      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {

    //check if item already in the cart
    let alreadyExit: boolean = false;
    let existingCartItem!: CartItem;

    if(this.cartItems.length > 0) {
      //find the item based on id

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;

    }

    //check if we found it
    alreadyExit = (existingCartItem != undefined);

    if(alreadyExit) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    // compute total price and quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new value
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);

    this.persistCartItems();
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    for(let temp of this.cartItems) {
      const subTotalPrice = temp.quantity * temp.unitPrice;
      console.log(`name: ${temp.name}, quantity: ${temp.quantity}, price=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('-----');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id);

    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }

  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
