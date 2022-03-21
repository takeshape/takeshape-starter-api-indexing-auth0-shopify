import { gql } from '@apollo/client';
// export const GetStripeProducts = gql`
//   query GetStripeProductsQuery {
//     products: getStripeProducts {
//       id
//       name
//       description
//       images
//       prices {
//         id
//         unitAmount: unit_amount
//         currency
//         recurring {
//           interval
//           intervalCount: interval_count
//         }
//       }
//     }
//   }
// `;

//done
export const GetShopifyAndRechargeProducts = gql`
  query getShopifyAndRechargeProducts($first: Int) {
    products: getShopifyAndRechargeProducts(first: $first) {
      shopify {
        edges {
          node {
            variants {
              edges {
                node {
                  id
                  inventoryQuantity
                }
              }
            }
            sellingPlanGroupCount
            id
            name: title
            description
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            priceRangeV2 {
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
      recharge {
        products {
          shopify_product_id
          discount_amount
          subscription_defaults {
            order_interval_unit
            charge_interval_frequency
            storefront_purchase_options
          }
        }
      }
    }
  }
`;

//done
export const GetMyProfile = gql`
  query GetMyProfile {
    profile: getMyProfile {
      id
      email
      name
      bio
      avatar {
        path
      }
      customer: shopifyCustomer {
        id
        name: displayName
        address: defaultAddress {
          line1: address1
          line2: address2
          city
          state: province
          postal_code: zip
          country
        }
      }
    }
  }
`;

//done
export const UpsertMyProfile = gql`
  mutation UpsertMyProfile($name: String, $bio: String, $avatarId: String) {
    profile: upsertMyProfile(name: $name, bio: $bio, avatarId: $avatarId) {
      id
      email
      name
      bio
      avatar {
        path
      }
      customer: shopifyCustomer {
        id
        name: displayName
        address: defaultAddress {
          line1: address1
          line2: address2
          city
          state: province
          postal_code: zip
          country
        }
      }
    }
  }
`;

//done
export const UploadAssets = gql`
  mutation UploadAssets($files: [TSFile]!) {
    uploadAssets(files: $files) {
      uploadUrl
      asset {
        _id
        _version
        filename
      }
    }
  }
`;

//done
export const UpsertMyCustomer = gql`
  mutation UpsertMyCustomer(
    $firstName: String
    $lastName: String
    $description: String
    $address: Stripe_CustomerAddressPropertyInput
  ) {
    customer: upsertMyCustomer(
      firstName: $firstName
      lastName: $lastName
      description: $description
      address: $address
    ) {
      customer {
        id
        name: displayName
        address: defaultAddress {
          line1: address1
          line2: address2
          city
          state: province
          postal_code: zip
          country
        }
      }
    }
  }
`;

//done
export const CreateMyCheckoutSession = gql`
  mutation createMyCheckoutSessionQuery($input: CheckoutCreateInput) {
    createMyCheckoutSession(input: $input) {
      checkout {
        webUrl
      }
      checkoutUserErrors {
        code
        fields
        message
      }
    }
  }
`;

//done
export const GetMySubscriptions = gql`
  query GetMySubscriptionsQuery($shopifyCustomerIdNumber: Int) {
    subscriptions: getMySubscriptions(shopifyCustomerIdNumber: $shopifyCustomerIdNumber) {
      items: subscriptions {
        id
        next_charge_scheduled_at
        unitAmount: price
        orderIntervalUnit: order_interval_unit
        product: recharge_product {
          name: title
          images {
            large
            medium
            original
            small
          }
          id: product_id
        }
      }
    }
  }
`;

//done
export const DeleteMySubscription = gql`
  mutation DeleteMySubscription($subscriptionId: String!) {
    subscription: deleteMySubscription(subscriptionId: $subscriptionId) {
      id
      status
    }
  }
`;

//! Doesn't seem to do anything? Can't find it anywhere in the project
export const GetMyInvoices = gql`
  query GetMyInvoicesQuery {
    invoices: getMyInvoices(status: "paid") {
      id
      total
      currency
      invoicePdf: invoice_pdf
      paid
      created
      lines {
        data {
          id
          amount
          currency
          description
          quantity
        }
      }
    }
  }
`;

//done
export const GetMyPayments = gql`
  query GetMyPaymentsQuery {
    payments: getMyPayments {
      id
      orders {
        edges {
          node {
            processedAt
            customerUrl
            currentTotalPrice {
              amount
              currencyCode
            }
            id
            financialStatus
          }
        }
      }
    }
  }
`;
