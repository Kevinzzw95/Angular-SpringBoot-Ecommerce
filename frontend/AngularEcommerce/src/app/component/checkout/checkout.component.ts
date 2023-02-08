import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {ShopFormService} from "../../services/shop-form.service";
import {ShopValidators} from "../../validators/shop-validators";
import {CartService} from "../../services/cart.service";
import {sfExtensionData} from "@angular/compiler-cli/src/ngtsc/shims";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";
import {Province} from "../../common/province";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonth: number[] = [];
  creditCardYear: number[] = [];

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace]),
        email: new FormControl('',
          [Validators.required,
            Validators.pattern('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$'),
            ShopValidators.notOnlyWhitespace])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace]),
        province: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace]),
        province: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        nameOnCard: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    this.handleMonthsAndYears();

    this.reviewCartDetails();
  }

  onSubmit() {
    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;
    //set up purchase
    let orderItems: OrderItem[] = cartItems.map(temp => new OrderItem(temp));
    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingProvince: Province = JSON.parse(JSON.stringify(purchase.shippingAddress.province));
    purchase.shippingAddress.province = shippingProvince.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingProvince: Province = JSON.parse(JSON.stringify(purchase.billingAddress.province));
    purchase.billingAddress.province = billingProvince.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    // call rest api
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\n Order tracking number: ${response.trackingNumber}`);

          // reset cart
          this.resetCart();

        },
        error: err => {
          alert(`There was an error: ${err.media}`);
        }
      }
    );

  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset form data
    this.checkoutFormGroup.reset();

    this.storage.setItem('cartItems', '[]');
    // navigate to purchase page
    this.router.navigateByUrl("/products");
  }

  cpShippingToBilling(event: any) {
    if(event.target.checked) {
      this.checkoutFormGroup.get('billingAddress')
            ?.setValue(this.checkoutFormGroup.get('shippingAddress')?.value);
    }
    else {
      this.checkoutFormGroup.get('billingAddress')?.reset();
    }
  }

  handleMonthsAndYears() {
    const startMonth: number = 1;

    this.shopFormService.getCreditCardMonth(startMonth).subscribe(
      data => {
        console.log("month:" + JSON.stringify(data));
        this.creditCardMonth = data;
      }
    );

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("month:" + JSON.stringify(data));
        this.creditCardYear = data;
      }
    );
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressProvince() {
    return this.checkoutFormGroup.get('shippingAddress.province');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressProvince() {
    return this.checkoutFormGroup.get('billingAddress.province');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

}
