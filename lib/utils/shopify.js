import Client from 'shopify-buy';
import { shopifyDomain, shopifyPublishableKey } from 'lib/config';

export const shopifyClient = Client.buildClient({
  storefrontAccessToken: '8377d17818362da5dd877c3be24419e5', //shopifyPublishableKey,
  domain: 'https://takeshapetestsite.myshopify.com/' //shopifyDomain
});
