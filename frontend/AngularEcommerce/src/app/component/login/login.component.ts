import {Component, Inject, OnInit} from '@angular/core';
import {OktaAuth} from "@okta/okta-auth-js";
import myAppConfig from "../../config/my-app-config";
import {OKTA_AUTH} from "@okta/okta-angular";
import OktaSignIn from '@okta/okta-signin-widget';
import {error} from "@angular/compiler-cli/src/transformers/util";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      },
      features: {
        registration: true,
        multiOptionalFactorEnroll: true
      },
      registration: {
        click: () => {
          window.location.href = 'https://acme.com/sign-up';
        }
      }
    });

  }

  ngOnInit(): void {
    this.oktaSignin.remove();

    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'}, // same as div tag id in html
      (response: any) => {
        if(response.status == 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();

        }
      },
      (error: any) => {
        throw error;
      }
    );

  }

}
