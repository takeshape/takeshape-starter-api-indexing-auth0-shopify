import { Heading, Divider, Alert, Spinner, Container } from '@theme-ui/components';
import { Page } from 'components/layout';
import { ProductList } from 'components/products';
import { takeshapeApiUrl, takeshapeApiKey } from 'lib/config';
import { listRechargeProducts, Shopify_products, listIndexedProducts } from 'lib/queries';
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
    let { data: indexedData } = await client.query({
      query: listIndexedProducts,
      errorPolicy: 'ignore'
    });

    if (!indexedData || indexedData?.errors) {
      error = indexedData.errors;
      throw error;
    } else {
      products.shopifyProducts = indexedData.products.shopify.items;
      products.rechargeProducts = indexedData.products.recharge.items;
    }
  } catch (err) {
    let freshData;
    try {
      const { data: shopifyData } = await client.query({
        query: Shopify_products,
        errorPolicy: 'ignore'
      });

      const { data: rechargeData } = await client.query({
        query: listRechargeProducts,
        errorPolicy: 'ignore'
      });

      const dataErrors = [];
      shopifyData?.errors && dataErrors.push(shopifyData.errors);
      rechargeData?.errors && dataErrors.push(rechargeData.errors);

      freshData = {
        shopifyData,
        rechargeData,
        errors: dataErrors
      };

      if (freshData?.errors.length > 0) {
        throw freshData.errors;
      } else {
        products.shopifyProducts = freshData.shopifyData.products.edges;
        products.rechargeProducts = freshData.rechargeData.products.items;
      }
    } catch (errors) {
      console.error(errors);
      error = Array.isArray(errors) ? errors.map((e) => e.message).join() : errors.message;
    }
  } finally {
    return { props: { products, error: error ?? null } };
  }
}

export default HomePage;
