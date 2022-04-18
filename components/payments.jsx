import { Grid, Box, Card, IconButton, Paragraph, Text } from '@theme-ui/components';
import { format } from 'date-fns';
import { FiCheckCircle, FiArrowDownCircle } from 'react-icons/fi';

export const PaymentItemCard = ({ payment: { created, invoice, amount } }) => {
  //Add an extra decimal place
  amount = Number(amount).toFixed(2);
  return (
    <Card>
      <Grid gap={2} columns={2}>
        <Box>
          <Text variant="smallHeading" sx={{ color: 'lightGray' }}>
            {format(new Date(created), 'PP')}
          </Text>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          {invoice?.invoicePdf ? (
            <IconButton as="a" target="_blank" href={invoice.invoicePdf}>
              <FiArrowDownCircle />
            </IconButton>
          ) : null}
          {invoice?.paid === true ? <FiCheckCircle color="green" /> : null}
        </Box>
      </Grid>
      Total: ${amount}
    </Card>
  );
};

export const PaymentList = ({ payments }) => {
  return (
    <>
      {payments.length ? (
        <Grid gap={3} columns={1}>
          {payments.reverse().map((payment) => (
            <Box key={payment.id}>
              <PaymentItemCard payment={payment} />
            </Box>
          ))}
        </Grid>
      ) : (
        <Paragraph>No payments to display!</Paragraph>
      )}
    </>
  );
};
