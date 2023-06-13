import { useState, useEffect } from 'react';

/**
 * The component that provides an interface for the conversational decision
 * support system.
 */
function ConversationalSystem() {
  let [messages, setMessages] = useState([]);

  // Fetch a response from the server.
  const fetchMessage = () => {
    fetch('http://localhost:8000/conversation/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messages)
    })
      .then(response => response.json())
      .then(data => {
        setMessages([...messages, {
          "sender": "tool",
          "message": data
        }]);
      });
  }

  // Update the state by adding the user's new message.
  const newUserMessage = (message) => {
    setMessages([...messages, {
      "sender": "user",
      "message": message
    }]);
  }

  // If messages updates, and the last message was sent by the user, fetch a
  // response from the system.
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === "user") {
      fetchMessage();
    }
  }, [messages]);

  return (
    <>
      <h2>Conversational System</h2>
      <ChatHistory
        messages={messages}
      />
      <MessageInput
        onEnterPress={newUserMessage}
      />
    </>
  );
}

/**
 * A component that displays a chat history with the given mesages.
 */
function ChatHistory({ messages }) {
  // Display all messages.
  return (
    <div className='chat-history'>
      {messages.map((message, index) => (
        <p
          className={"message message-" + message.sender}
          key={'message-' + index}
        >{message.message}</p>
      ))}
    </div>
  )
}

/**
 * A component that allows the user to type a message and press enter to send
 * it. Takes a function to call on enter press as props.
 */
function MessageInput({ onEnterPress }) {
  // Handle pressing enter on the input field.
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      if (typeof onEnterPress === "function") {
        onEnterPress(event.target.value);
      }

      event.target.value = "";
    }
  }

  return (
    <input
      type="text"
      name="msg-input"
      className="message-box"
      placeholder="typ een bericht..."
      onKeyUp={(e) => {handleKeyPress(e)}}
    />
  )
}

export default ConversationalSystem;
