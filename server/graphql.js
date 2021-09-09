import { gql } from 'apollo-server-core';
import { PubSub } from 'graphql-subscriptions';
import { v4 as uid } from 'uuid';
import data from './data.json';

const pubsub = new PubSub();
const POST_CREATED = 'POST_CREATED';
const messages = data.sort(
  (m1, m2) => new Date(m2.createdAt) - new Date(m1.createdAt)
);

const typeDefs = gql`
  type Message {
    id: ID!
    username: String!
    text: String!
    createdAt: String!
  }

  type PaginatedMessages {
    nodes: [Message]
    hasMore: Boolean!
  }

  type Query {
    getMessages(limit: Int!, offset: Int): PaginatedMessages
  }

  type Mutation {
    addMessage(username: String!, text: String!): Message
  }

  type Subscription {
    newMessage: Message
  }
`;

const resolvers = {
  Query: {
    getMessages: (root, { limit, offset = 0 }, ctx, info) => {
      const paginatedMesssages = messages.slice(offset, offset + limit);
      return {
        nodes: paginatedMesssages,
        hasMore: paginatedMesssages.length === limit,
      };
    },
  },
  Mutation: {
    addMessage: (_root, args) => {
      if (!args.username || !args.text) return null;
      const createdMsg = {
        id: uid(),
        ...args,
        createdAt: new Date().toISOString(),
      };
      messages.unshift(createdMsg);
      pubsub.publish(POST_CREATED, {
        newMessage: createdMsg,
      });
      return createdMsg;
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator([POST_CREATED]),
    },
  },
};

import { makeExecutableSchema } from '@graphql-tools/schema';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { typeDefs, resolvers };
export default schema;
