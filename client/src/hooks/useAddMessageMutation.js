import { gql } from '@urql/core';
import { useMutation } from 'urql';

export const ADD_MESSAGE_DOC = gql`
  mutation AddMessage($username: String!, $text: String!) {
    addMessage(username: $username, text: $text) {
      id
      username
      text
      createdAt
    }
  }
`;

const useAddMessageMutation = () => useMutation(ADD_MESSAGE_DOC);

export default useAddMessageMutation;
