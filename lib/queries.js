import { gql } from '@apollo/client';

export const GetShopifyAndRechargeProducts = gql`
  {
    products: getIndexedProductList {
      shopify {
        items {
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
          variants {
            edges {
              node {
                id
                price
              }
            }
          }
        }
      }
      recharge {
        items {
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

export const UpsertMyCustomer = gql`
  mutation UpsertMyCustomer(
    $firstName: String
    $lastName: String
    $description: String
    $address: Storefront_CustomerCreatePayloadAddressPropertyInput
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

export const CreateMyCheckoutSession = gql`
  mutation createMyCheckoutSessionQuery($input: ShopifyStorefront_CheckoutCreateInput!) {
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

export const GetMySubscriptions = gql`
  query GetMySubscriptionsQuery {
    subscriptions: getMySubscriptions {
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

export const DeleteMySubscription = gql`
  mutation DeleteMySubscription($subscriptionId: Float!) {
    subscription: deleteMySubscription(subscriptionId: $subscriptionId) {
      _id
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
