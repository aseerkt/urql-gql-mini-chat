import {
  createClient,
  subscriptionExchange,
  dedupExchange,
  fetchExchange,
} from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { cacheExchange } from '@urql/exchange-graphcache';
import { createClient as createWSClient } from 'graphql-ws';
import { GET_MESSAGES_DOC } from '../hooks/useGetMessagesQuery';
import { offsetPagination } from './utils';

const wsClient = createWSClient({
  url: 'ws://localhost:4000/graphql',
});

const client = createClient({
  url: 'http://localhost:4000/graphql',
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedMessages: () => null,
      },
      resolvers: {
        Query: {
          getMessages: offsetPagination(),
        },
      },
      updates: {
        Subscription: {
          newMessage: (result, _args, cache) => {
            if (!result.newMessage) return;
            console.log(result.newMessage);
            cache.updateQuery(
              { query: GET_MESSAGES_DOC, variables: { limit: 10 } },
              (data) => ({
                getMessages: {
                  ...data.getMessages,
                  nodes: [...data.getMessages.nodes, result.newMessage],
                },
              })
            );
          },
        },
      },
    }),
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  ],
});

export default client;
