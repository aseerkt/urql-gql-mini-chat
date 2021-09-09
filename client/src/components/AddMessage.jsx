import { useState } from 'react';
import useAddMessageMutation from '../hooks/useAddMessageMutation';

function AddMessage() {
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [{ fetching }, addMessage] = useAddMessageMutation();

  return (
    <div className='AddMessage'>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!username || !text) alert('Please provide username and messge');
          const res = await addMessage({ username, text });
          if (res.data.addMessage) {
            setText('');
          }
          if (res.error) {
            alert(JSON.stringify(res.error));
          }
        }}
      >
        <input
          type='text'
          placeholder='username'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='text'
          placeholder='text'
          id='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button disabled={fetching} type='submit'>
          Send
        </button>
      </form>
    </div>
  );
}

export default AddMessage;
