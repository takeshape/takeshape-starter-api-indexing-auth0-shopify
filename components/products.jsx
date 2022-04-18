import { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Heading,
  Paragraph,
  Button,
  Select,
  Label,
  Radio,
  AspectImage,
  Flex
} from '@theme-ui/components';
import { range } from 'lib/utils/range';
import { pluralizeText, formatPrice } from 'lib/utils/text';
import { useCart } from 'lib/cart';
import { get as lodashGet } from 'lodash';

const showCartTimeout = 3000;
const oneTimePurchase = 'one-time';
const recurringPurchase = 'recurring';

export const ProductPrice = ({ purchaseType, price, rechargeProduct, quantity }) => {
  quantity = quantity ?? 1;

  const recurringText =
    purchaseType == recurringPurchase
      ? `every ${pluralizeText(
          rechargeProduct.subscription_defaults.charge_interval_frequency,
          rechargeProduct.subscription_defaults.order_interval_unit,
          `${rechargeProduct.subscription_defaults.order_interval_unit}s`
        )}`
      : null;
  return (
    <Box sx={{ fontWeight: 'bold' }}>
      {formatPrice('usd', price * quantity)} {recurringText}
    </Box>
  );
};

export const ProductImage = (images) => {
  const imageUrl = lodashGet(images, 'images[0].node.url', null);
  return imageUrl ? <AspectImage src={imageUrl} ratio={1} /> : null;
};

export const ProductPaymentToggle = ({ purchaseType, onChange }) => {
  return (
    <Box>
      <Label>
        <Radio value={oneTimePurchase} checked={purchaseType === oneTimePurchase} onChange={onChange} />
        One-Time Purchase
      </Label>
      <Label>
        <Radio value={recurringPurchase} checked={purchaseType === recurringPurchase} onChange={onChange} />
        Subscribe &amp; Save!
      </Label>
    </Box>
  );
};

export const ProductRecurringSelect = ({ currentPrice, rechargeProduct, onChange }) => {
  return (
    <Box>
      Subscription
      <Select value={currentPrice} onChange={onChange}>
        <option value={rechargeProduct.shopify_product_id}>
          Every{' '}
          {pluralizeText(
            rechargeProduct.subscription_defaults.charge_interval_frequency,
            rechargeProduct.subscription_defaults.order_interval_unit,
            `${rechargeProduct.subscription_defaults.order_interval_unit}s`
          )}
        </option>
      </Select>
    </Box>
  );
};

export const ProductQuantitySelect = ({ defaultValue, onChange }) => {
  return (
    <Box variant="product.quantity">
      <Select defaultValue={defaultValue ?? 1} onChange={onChange}>
        {range(10).map((num) => (
          <option key={num} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export const ProductCard = ({ shopifyProduct, rechargeProduct }) => {
  const {
    isCartOpen,
    actions: { addToCart, openCart, toggleCart }
  } = useCart();

  const recurringText = rechargeProduct
    ? `every ${pluralizeText(
        rechargeProduct.subscription_defaults.charge_interval_frequency,
        rechargeProduct.subscription_defaults.order_interval_unit,
        `${rechargeProduct.subscription_defaults.order_interval_unit}s`
      )}`
    : null;
  const { title, description, images: imageEdgesContainer } = shopifyProduct;
  //This takes the max variant price if no price is found. Not perfect
  //but okay for the purposes of a demo for now.
  const getPriceString = 'variants.edges[0].node.price';
  const shopifyPrice = lodashGet(
    shopifyProduct,
    getPriceString,
    shopifyProduct?.priceRangeV2?.maxVariantPrice?.amount ?? 0
  );

  const [purchaseType, setPurchaseType] = useState(
    rechargeProduct && rechargeProduct.subscription_defaults.storefront_purchase_options == 'subscription_and_onetime'
      ? recurringPurchase
      : oneTimePurchase
  );

  const [quantity, setQuantity] = useState(1);
  const basePrice = Number(shopifyPrice);
  const discount =
    rechargeProduct && rechargeProduct.discount_amount ? (rechargeProduct.discount_amount / 100) * basePrice : 0;
  const subscriptionPrice = basePrice - discount;
  const [price, setPrice] = useState(purchaseType == oneTimePurchase ? basePrice : subscriptionPrice);

  const handleUpdatePurchaseType = (event) => {
    const { value } = event.target;

    setPurchaseType(value);

    if (value === oneTimePurchase) {
      setPrice(basePrice);
    }

    if (value === recurringPurchase) {
      setPrice(subscriptionPrice);
    }
  };

  const handleUpdateQuantity = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handleUpdateRecurring = (event) => {
    setPurchaseType(recurringPurchase);
    setPrice(subscriptionPrice);
  };

  const handleAddToCart = () => {
    addToCart({ ...shopifyProduct, price, quantity, purchaseType });
    if (!isCartOpen) {
      openCart();
      setTimeout(() => toggleCart(), showCartTimeout);
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <Flex sx={{ height: '100%', flexDirection: 'column' }}>
        <Box>
          <ProductImage images={imageEdgesContainer.edges} />
        </Box>
        <Box>
          <Heading>{title}</Heading>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Paragraph>{description}</Paragraph>
        </Box>
        <Box>
          <ProductPrice purchaseType={purchaseType} rechargeProduct={rechargeProduct} price={price} />

          {rechargeProduct &&
          rechargeProduct.subscription_defaults.storefront_purchase_options === 'subscription_and_onetime' ? (
            <ProductPaymentToggle
              recurringText={recurringText}
              purchaseType={purchaseType}
              onChange={handleUpdatePurchaseType}
            />
          ) : null}

          {rechargeProduct ? (
            <ProductRecurringSelect
              currentPrice={price}
              rechargeProduct={rechargeProduct}
              onChange={handleUpdateRecurring}
            />
          ) : null}

          <Box>Quantity</Box>
          <Grid columns={[2]}>
            <ProductQuantitySelect onChange={handleUpdateQuantity} />
            <Button type="button" onClick={handleAddToCart}>
              <small>ADD TO CART</small>
            </Button>
          </Grid>
        </Box>
      </Flex>
    </Card>
  );
};

export const ProductList = ({ shopifyProducts, rechargeProducts }) => {
  return (
    <>
      {shopifyProducts.length ? (
        <Grid gap={2} columns={3} sx={{ gridAutoRows: '1fr' }}>
          {shopifyProducts.map((product) => {
            if (product.node) {
              //If we had to fetch without the API Index, this is necessary
              product = product.node;
            }
            //Find the recharge product that matches the shopify product,
            //if it exists
            const rechargeProduct =
              product.sellingPlanGroupCount > 0
                ? rechargeProducts.find((currRechargeProduct) =>
                    product.id.includes(currRechargeProduct.shopify_product_id)
                  )
                : null;
            return (
              <Box key={product.id} sx={{ height: '100%' }}>
                <ProductCard shopifyProduct={product} rechargeProduct={rechargeProduct} />
              </Box>
            );
          })}
        </Grid>
      ) : (
        <Paragraph>No products to display!</Paragraph>
      )}
    </>
  );
};
