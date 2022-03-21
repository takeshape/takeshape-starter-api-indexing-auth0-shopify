import Client from 'shopify-buy';
import { shopifyDomain, shopifyPublishableKey } from 'lib/config';

export const client = Client.buildClient({
  storefrontAccessToken: shopifyPublishableKey,
  domain: shopifyDomain
});
