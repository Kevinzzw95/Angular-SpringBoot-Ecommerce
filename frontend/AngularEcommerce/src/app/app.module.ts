import {Injector, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './component/product-list/product-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ProductService} from "./services/product.service";
import {Router, RouterModule, Routes} from '@angular/router';
import { ProductCategoryMenuComponent } from './component/product-category-menu/product-category-menu.component';
import { SearchComponent } from './component/search/search.component';
import { ProductDetailsComponent } from './component/product-details/product-details.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { CartStatusComponent } from './component/cart-status/cart-status.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CartDetailsComponent } from './component/cart-details/cart-details.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { LoginComponent } from './component/login/login.component';
import { LoginStatusComponent } from './component/login-status/login-status.component';

import {
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG, OktaAuthGuard,
} from "@okta/okta-angular";

import { OktaAuth } from "@okta/okta-auth-js";

import myAppConfig from "./config/my-app-config";
import { OrderHistoryComponent } from './component/order-history/order-history.component';
import {AuthInterceptorService} from "./services/auth-interceptor.service";

const oktaConfig = myAppConfig.oidc;

const oktaAuth = new OktaAuth(oktaConfig);

const routes: Routes = [

  {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard]},

  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},

  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},

];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [ProductService, { provide: OKTA_CONFIG, useValue: { oktaAuth }},
                              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
