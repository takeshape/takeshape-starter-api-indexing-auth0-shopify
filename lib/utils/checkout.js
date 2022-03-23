const getRedirectUrl = (redirectUrl) => {
  redirectUrl = redirectUrl ?? window.location.pathname;

  if (redirectUrl.startsWith('http')) {
    return redirectUrl;
  }

  return new URL(redirectUrl, window.location.origin).href;
};

export const getCheckoutPayload = (items) => {
  return {
    input: {
      lineItems: items.map((item) => ({
        quantity: item.quantity,
        variantId: item.variants.edges[0].node.id
      }))
    }
  };
};
