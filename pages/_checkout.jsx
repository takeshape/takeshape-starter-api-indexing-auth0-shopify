import { useEffect } from 'react';
import { Container, Spinner } from '@theme-ui/components';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { useCart } from 'lib/cart';
import { useApolloClient } from '@apollo/client';
import { getCheckoutPayload } from 'lib/utils/checkout';
import { CreateMyCheckoutSession } from 'lib/queries';
import { useProfile } from 'lib/takeshape';

// After a successful login, redirect here to automatically checkout with the cart
function _CheckoutPage() {
  const { isProfileReady } = useProfile();
  const client = useApolloClient();
  const {
    items,
    actions: { clearCart }
  } = useCart();

  useEffect(() => {
    const doCheckout = async () => {
      const { data } = await client.mutate({
        mutation: CreateMyCheckoutSession,
        variables: getCheckoutPayload(items)
      });

      clearCart();
      window.location.assign(data.createMyCheckoutSession.checkoutUrl);
    };
    if (isProfileReady) {
      doCheckout();
    }
  }, [client, clearCart, items, isProfileReady]);

  return (
    <Container variant="layout.loading">
      <Spinner />
    </Container>
  );
}

export default withAuthenticationRequired(_CheckoutPage, {
  onRedirecting: () => (
    <Container variant="layout.loading">
      <Spinner />
    </Container>
  )
});
