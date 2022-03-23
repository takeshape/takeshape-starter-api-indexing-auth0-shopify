import { Grid, Box, Card, Heading, Paragraph, Text, Alert } from '@theme-ui/components';
import { useMutation } from '@apollo/client';
import { formatPrice } from 'lib/utils/text';
import { DeleteMySubscription, GetMySubscriptions } from 'lib/queries';
import { locale } from 'lib/config';
import { SubmitButton } from './buttons';
import { ProductImage } from './products';

export const SubscriptionItemCard = ({ subscriptionItem }) => {
  const [setCancelPayload, { error: cancelError, loading: cancelLoading }] = useMutation(DeleteMySubscription, {
    refetchQueries: [GetMySubscriptions],
    awaitRefetchQueries: true,
    variables: {
      subscriptionId: subscriptionItem.id
    }
  });

  const { next_charge_scheduled_at: currentPeriodEnd } = subscriptionItem;
  const nextBillDate = new Date(currentPeriodEnd);

  const { product } = subscriptionItem;

  const handleCancelSubscription = () => {
    setCancelPayload({
      variables: { subscriptionId: subscriptionItem.id }
    });
  };

  //Map the images to the type of object ProductImage will use,
  //which is images[0].node.url
  const imageArray = Object.keys(product.images).map((imgSize) => {
    return {
      node: { url: product.images[imgSize] }
    };
  });

  //Remove first element of the array because it never has a url
  imageArray.shift();

  return (
    <Card>
      <ProductImage images={imageArray} />
      <Heading>{product.name}</Heading>
      <Paragraph>
        <Text>
          {formatPrice('USD', subscriptionItem.unitAmount)} / {subscriptionItem.orderIntervalUnit || ''}
        </Text>
      </Paragraph>
      <Paragraph>
        <strong>Next Bill:</strong>{' '}
        <Text>{nextBillDate.toLocaleString(locale, { month: 'long', year: 'numeric', day: 'numeric' })}</Text>
      </Paragraph>

      {cancelError && (
        <>
          <Alert>Error canceling Recharge subscription</Alert>
          <pre style={{ color: 'red' }}>{JSON.stringify(cancelError, null, 2)}</pre>
        </>
      )}

      <SubmitButton text="Cancel" onClick={handleCancelSubscription} isSubmitting={cancelLoading} />
    </Card>
  );
};

export const SubscriptionList = ({ subscriptionItems }) => {
  return (
    <>
      {subscriptionItems && subscriptionItems?.length ? (
        <Grid gap={2} columns={3}>
          {subscriptionItems.map((subscriptionItem) => (
            <Box key={subscriptionItem.id}>
              <SubscriptionItemCard subscriptionItem={subscriptionItem} />
            </Box>
          ))}
        </Grid>
      ) : (
        <Paragraph>No subscriptions to display!</Paragraph>
      )}
    </>
  );
};
