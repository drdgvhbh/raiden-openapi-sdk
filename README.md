# Raiden OpenAPI SDK

This project is an typescript SDK for the [Raiden API](https://raiden-network.readthedocs.io/en/stable/rest_api.html). It was generated using [openapi-generator](https://github.com/OpenAPITools/openapi-generator) from the [swagger](./swagger.yaml) file I made.

This is a low level entrypoint for the API. You can find the higher level abstraction [here](https://github.com/drdgvhbh/raiden-api-sdk).

## Installation

`npm install raiden-openapi-sdk`

## Usage

```typescript
import {
  Configuration,
  ConfigurationParameters,
  ChannelsApi,
  RaidenNodeApi,
  PaymentsApi,
  PendingTransfersApi,
  TokensApi,
  ConnectionsApi
} from 'raiden-swagger-sdk';

const configuration = new Configuration({
  basePath: 'http://127.0.0.1:5001/api/v1' // is the default
});
const channelsApi = new ChannelsApi(configuration);
const raidenNodeApi = new RaidenNodeApi(configuration);
const paymentsApi = new PaymentsApi(configuration);
const pendingTransfersApi = new PendingTransfersApi(configuration);
const tokensApi = new TokensApi(configuration);
const connectionsApi = new ConnectionsApi(configuration);
```

## Contributing

Since the code is generated, any changes should be directed at the [swagger.yaml](./swagger.yaml) file. If you are adding a new API route, doucment where it is in the official Raiden API docs in your PR.
