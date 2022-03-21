import { Heading, Divider, Alert, Spinner, Container } from '@theme-ui/components';
import { Page } from 'components/layout';
import { ProductList } from 'components/products';
import { takeshapeApiUrl, takeshapeApiKey } from 'lib/config';
import { GetShopifyAndRechargeProducts } from 'lib/queries';
import { createApolloClient } from 'lib/apollo';

function HomePage({ products, error }) {
  return (
    <Page>
      <Heading as="h1">Products</Heading>
      <Divider />

      {!products.shopifyProducts && (
        <Container variant="layout.loading">
          <Spinner />
        </Container>
      )}

      {products.shopifyProducts && (
        <ProductList shopifyProducts={products.shopifyProducts} rechargeProducts={products.rechargeProducts} />
      )}

      {error && (
        <>
          <Alert>Error loading products</Alert>
          <pre style={{ color: 'red' }}>{JSON.stringify(error, null, 2)}</pre>
        </>
      )}
    </Page>
  );
}

export async function getStaticProps() {
  const client = createApolloClient(takeshapeApiUrl, () => takeshapeApiKey);

  const products = {
    shopifyProducts: [],
    rechargeProducts: []
  };
  let error = null;

  try {
    const { data } = await client.query({
      query: GetShopifyAndRechargeProducts,
      variables: {
        first: 20
      }
    });

    if (data.errors) {
      error = data.errors;
    } else {
      products.shopifyProducts = data.products.shopify.edges;
      products.rechargeProducts = data.products.recharge.products;
    }
  } catch (err) {
    console.error(err);
    error = Array.isArray(err) ? err.map((e) => e.message).join() : err.message;
  } finally {
    return { props: { products, error } };
  }
}

export default HomePage;
