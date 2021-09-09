import { gql } from '@urql/core';
import { useSubscription } from 'urql';

export const NEW_MESSAGE_DOC = gql`
  subscription NewMessage {
    newMessage {
      id
      username
      text
      createdAt
    }
  }
`;

const useNewMessageSubscription = (opts) =>
  useSubscription({ query: NEW_MESSAGE_DOC, ...opts });

export default useNewMessageSubscription;
