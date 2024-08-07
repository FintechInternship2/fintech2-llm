import axios from 'axios';
import React, { useState } from 'react';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(''); // 유저 ID를 설정할 수 있도록 합니다.

  const endChatSession = () => {
    const chatContent = messages.join('\n');

    axios.post('http://localhost:8000/api/chatsessions/', {
      user_id: userId,
      chat_content: chatContent,
    })
    .then(response => {
      console.log('Chat session saved:', response.data);
    })
    .catch(error => {
      console.error('There was an error saving the chat session!', error);
    });
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Enter your user ID" 
        value={userId} 
        onChange={(e) => setUserId(e.target.value)} 
      />
      {/* 채팅 UI와 로직이 여기에 들어갑니다 */}
      <button onClick={endChatSession}>End Chat</button>
    </div>
  );
};

export default ChatComponent;
