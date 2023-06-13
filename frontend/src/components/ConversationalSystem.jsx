import { useState, useEffect } from 'react';

/**
 * The component that provides an interface for the conversational decision
 * support system.
 */
function ConversationalSystem() {
  let [messages, setMessages] = useState([]);

  const fetchMessage = () => {
    setMessages([...messages, "bericht" + messages.length]);
  }

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <>
      <h2>Conversational System</h2>
      <ChatHistory
        messages={messages}
      />
    </>
  );
}

function ChatHistory({ messages }) {
  return (
    <div className='chat-history'>
      {messages.map((message, index) => (
        <p className='message' key={'message-' + index}>{message}</p>
      ))}
    </div>
  )
}

export default ConversationalSystem;
