import { ThemeProvider } from 'theme-ui';
import theme from 'lib/theme';
import CartProvider from 'lib/contexts/cart';
import { Auth0Provider } from '@auth0/auth0-react';
import { clientId, domain, scope, audience, redirectUri } from 'lib/config';

export default function App({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      scope={scope}
      audience={audience}
      redirectUri={redirectUri}
      cacheLocation="localstorage"
    >
      <CartProvider>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </CartProvider>
    </Auth0Provider>
  );
}
