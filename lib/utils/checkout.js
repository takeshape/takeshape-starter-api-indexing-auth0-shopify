import { fallbackHttpConfig } from '@apollo/client';
import { get as lodashGet } from 'lodash';
const getRedirectUrl = (redirectUrl) => {
  redirectUrl = redirectUrl ?? window.location.pathname;

  if (redirectUrl.startsWith('http')) {
    return redirectUrl;
  }

  return new URL(redirectUrl, window.location.origin).href;
};

export const getCheckoutPayload = (items, redirectUrl) => {
  return {
    lines: items.map((item) => {
      /*To add a shopify subscription to the cart with their
      checkoutCreate mutation, you must add its selling plan id.
      To add a product, you must add its variant id.
      Merchandise id is required in any case.*/

      const line = {
        quantity: item.quantity,
        merchandiseId: item?.storefrontData?.variants?.edges[0]?.node?.id
      };

      if (item?.purchaseType === 'recurring') {
        const getSellingPlanIdString = 'storefrontData.sellingPlanGroups.edges[0].node.sellingPlans.edges[0].node.id';
        const fallbackId =
          item?.storefrontData?.variants?.edges[0]?.node?.sellingPlanAllocations?.edges[0]?.node?.sellingPlan?.id;

        line.sellingPlanId = lodashGet(item, getSellingPlanIdString, fallbackId ?? '');
      }

      return line;
    }),
    redirectUrl: getRedirectUrl(redirectUrl)
  };
};
