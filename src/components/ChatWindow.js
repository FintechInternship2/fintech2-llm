import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToChatbot } from '../api/chatbot';
import QuickActionButtons from './QuickActionButtons';
import sendButtonIcon from '../assets/icons/send_button.svg';
import chatbotIcon from '../assets/icons/chatbot_icon.svg';
import userIcon from '../assets/icons/default_image_icon.svg';
import '../styles/ChatWindow.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '',
      fullText: '안녕하세요 번개처럼 빠르게 도와드리는 챗봇입니다. 소개멘트를 작성해주세요 소개멘트를 작성해주세요 소개멘트를 작성해주세요. 지금정지해제를 위해서는 이의제기 신청서, 신분증 사본...',
      typing: true, // 타이핑 효과를 위한 플래그
      name: 'ChatBot'
    }
  ]);
  const [completedActions, setCompletedActions] = useState([]); // 각 버튼의 상태를 관리하는 배열
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    const lastMessageIndex = messages.length - 1;
    const lastMessage = messages[lastMessageIndex];

    if (lastMessage && lastMessage.typing) {
      let currentIndex = lastMessage.text.length;
      typingIntervalRef.current = setInterval(() => {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          if (currentIndex < lastMessage.fullText.length) {
            newMessages[lastMessageIndex] = {
              ...lastMessage,
              text: lastMessage.fullText.slice(0, currentIndex + 1),
              typing: true
            };
            currentIndex++;
          } else {
            clearInterval(typingIntervalRef.current);
            newMessages[lastMessageIndex] = {
              ...lastMessage,
              typing: false
            };
          }
          return newMessages;
        });
      }, 100); // 타이핑 속도 조절
    }

    return () => clearInterval(typingIntervalRef.current);
  }, [messages]);

  const quickActions = [
    { title: '이의제기신청서', subtitle: '이의제기' },
    { title: '신분증 사본(필수)', subtitle: '신분증 발급' },
    { title: '본인서명', subtitle: '정부24에서' },
    { title: '정보제공2', subtitle: '내용' },
    { title: '정보제공3', subtitle: '내용' },
    { title: '정보제공4', subtitle: '내용' },
    { title: '정보제공5', subtitle: '내용' },
    { title: '이렇게까지만함돠', subtitle: '내용' }
  ];

  const handleSendMessage = async (messageText) => {
    const userMessage = { type: 'user', text: messageText, fullText: messageText, typing: false, name: 'User' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await sendMessageToChatbot([...messages, userMessage]); // 배열로 전달
      const botMessage = {
        type: 'bot',
        text: '',
        fullText: response,
        typing: true,
        name: 'ChatBot'
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
    }
  };

  const handleActionClick = (actionTitle) => {
    setCompletedActions((prevActions) => {
      if (prevActions.includes(actionTitle)) {
        return prevActions.filter(title => title !== actionTitle); // 클릭된 버튼의 상태 해제
      } else {
        handleSendMessage(actionTitle);
        return [...prevActions, actionTitle]; // 클릭된 버튼의 상태 설정
      }
    });
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-icon">
          <img src={chatbotIcon} alt="Chatbot Icon" />
        </div>
        <div className="chat-header-title">
          <h1>챗봇</h1>
          <span>@카카오뱅크</span>
        </div>
      </div>
      <div className="chat-body">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type}`}>
            <div className="profile">
              <div className="avatar">
                <img src={message.type === 'bot' ? chatbotIcon : userIcon} alt="Avatar" />
              </div>
              <div className="name">{message.name}</div>
            </div>
            <div className="message">
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <QuickActionButtons actions={quickActions} completedActions={completedActions} onActionClick={handleActionClick} />
      </div>
      <div className="chat-footer">
        <input 
          type="text" 
          placeholder="궁금하신 내용을 입력해주세요." 
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleSendMessage(event.target.value);
              event.target.value = '';
            }
          }}
        />
        <button 
          onClick={() => {
            const input = document.querySelector('.chat-footer input');
            handleSendMessage(input.value);
            input.value = '';
          }}
        >
          <img src={sendButtonIcon} alt="Send Icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;