import {environment} from "../../environments/environment";

export default {
  oidc: {
    version: '6.9.0',
    clientId: '0oa7b9vv3gZ4rwIsQ5d7',
    issuer: 'https://dev-00372582.okta.com/oauth2/default',
    redirectUri: environment.hostUrl + '/login/callback',
    scopes: ['openid', 'profile', 'email']
  }
}
