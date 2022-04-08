import { gql } from '@apollo/client';

export const listIndexedProducts = gql`
  {
    products: listIndexedProducts {
      shopify {
        items {
          sellingPlanGroupCount
          sellingPlanGroups {
            edges {
              node {
                id
              }
            }
          }
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
          storefrontData {
            variants {
              edges {
                node {
                  id
                }
              }
            }
            sellingPlanGroups {
              edges {
                node {
                  sellingPlans {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                }
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

export const listShopifyAndRechargeProducts = gql`
  {
    products: listShopifyAndRechargeProducts(first: 20) {
      shopify {
        items: edges {
          node {
            sellingPlanGroupCount
            sellingPlanGroups {
              edges {
                node {
                  id
                }
              }
            }
            id
            name: title
            description
            images {
              edges {
                node {
                  url
                }
              }
            }
            priceRangeV2 {
              maxVariantPrice {
                amount
              }
            }
            variants {
              edges {
                node {
                  id
                }
              }
            }
            storefrontData {
              variants {
                edges {
                  node {
                    id
                  }
                }
              }
              sellingPlanGroups {
                edges {
                  node {
                    sellingPlans {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      recharge {
        items: products {
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
      firstName
      lastName
      bio
      avatar {
        path
      }
      shopifyCustomerId
      customer: shopifyCustomer {
        edges {
          node {
            id
            defaultAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              provinceCode
              zip
              country
            }
          }
        }
      }
    }
  }
`;

export const UpsertMyProfile = gql`
  mutation UpsertMyProfile($firstName: String, $lastName: String, $bio: String, $avatarId: String) {
    profile: upsertMyProfile(firstName: $firstName, lastName: $lastName, bio: $bio, avatarId: $avatarId) {
      id
      email
      firstName
      lastName
      bio
      avatar {
        path
      }
      shopifyCustomerId
      customer: shopifyCustomer {
        edges {
          node {
            id
            defaultAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              provinceCode
              zip
              country
            }
          }
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
    $id: String
    $firstName: String
    $lastName: String
    $description: String
    $defaultAddress: ProfileDefaultAddressPropertyInput
  ) {
    customer: upsertMyCustomer(
      id: $id
      firstName: $firstName
      lastName: $lastName
      description: $description
      defaultAddress: $defaultAddress
    ) {
      customer: shopifyCustomer {
        edges {
          node {
            id
            defaultAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              provinceCode
              zip
              country
            }
          }
        }
      }
    }
  }
`;

export const CreateMyCheckoutSession = gql`
  mutation createMyCheckoutSessionQuery($lines: [MyShopifyStorefront_CartLinesPropertyInput!]!) {
    createMyCheckoutSession(lines: $lines) {
      checkoutUrl
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
  mutation DeleteMySubscription($subscriptionId: Int!) {
    subscription: deleteMySubscription(subscriptionId: $subscriptionId) {
      _id
    }
  }
`;

export const GetMyPayments = gql`
  query GetMyPaymentsQuery {
    payments: getMyPayments(first: 20) {
      edges {
        node {
          id
          createdAt
          currentTotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          fullyPaid
        }
      }
    }
  }
`;
