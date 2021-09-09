import { useEffect, useRef, useState } from 'react';
import useGetMessagesQuery from '../hooks/useGetMessagesQuery';
import useNewMessageSubscription from '../hooks/useNewMessageSubscription';

function ListMessages() {
  const scrollRef = useRef(null);
  const [variables, setVariables] = useState({ limit: 10, offset: null });
  const [{ fetching, data }] = useGetMessagesQuery({
    variables,
  });

  useNewMessageSubscription();

  if (fetching) return <h1>Loading...</h1>;

  return (
    <div className='ListMessages'>
      <ul
        ref={scrollRef}
        onScroll={(e) => {
          const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;
          let shouldFetch = clientHeight - scrollTop > scrollHeight - 10;
          if (shouldFetch && data.getMessages.hasMore) {
            console.log('fetching more');
            setVariables({
              ...variables,
              offset: data.getMessages.nodes.length,
            });
          }
        }}
      >
        {data?.getMessages.nodes.map((m) => (
          <li className='MsgBox' key={m.id}>
            <strong>{m.username}</strong>
            <p>{m.text}</p>
            <small>
              {new Date(m.createdAt).toLocaleTimeString('en-IN', {
                hour12: true,
              })}{' '}
              |{' '}
              {new Date(m.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                year: '2-digit',
                day: '2-digit',
              })}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListMessages;
