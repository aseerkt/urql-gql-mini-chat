import { gql } from '@urql/core';
import { useQuery } from 'urql';

export const GET_MESSAGES_DOC = gql`
  query GetMessages($limit: Int!, $offset: Int) {
    getMessages(limit: $limit, offset: $offset) {
      nodes {
        id
        username
        text
        createdAt
      }
      hasMore
    }
  }
`;

const useGetMessagesQuery = (opts) =>
  useQuery({ query: GET_MESSAGES_DOC, ...opts });

export default useGetMessagesQuery;
