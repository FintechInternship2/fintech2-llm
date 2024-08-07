import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 import
import QuickActionButtons from './QuickActionButtons';
import sendButtonIcon from '../assets/icons/send_button.svg';
import uploadIcon from '../assets/icons/upload_icon.svg'; // 파일 업로드 아이콘 추가
import objectionDataStorageIcon from '../assets/icons/objection_data_storage_icon.svg'; // 보관함 아이콘
import previousRequestIcon from '../assets/icons/previous_request_icon.svg'; // 이전 내역 아이콘
import chattingStartIcon from '../assets/icons/chatting_start_icon.svg'; // 채팅 시작 아이콘
import '../styles/ChatWindow.css';
import { useAuth } from '../AuthContext'; // AuthContext에서 상태를 가져옴

const ChatWindow = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const initialMessage = [];

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : initialMessage;
  });

  const [hasShownObjectionMessage, setHasShownObjectionMessage] = useState(() => {
    const savedState = localStorage.getItem('hasShownObjectionMessage');
    return savedState ? JSON.parse(savedState) : false;
  });

  const [hasShownAuthMessage, setHasShownAuthMessage] = useState(() => {
    const savedState = localStorage.getItem('hasShownAuthMessage');
    return savedState ? JSON.parse(savedState) : false;
  });

  const { isAuthenticated, completedActions, resetAction } = useAuth(); // AuthContext에서 상태를 가져옴
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('hasShownObjectionMessage', JSON.stringify(hasShownObjectionMessage));
  }, [hasShownObjectionMessage]);

  useEffect(() => {
    localStorage.setItem('hasShownAuthMessage', JSON.stringify(hasShownAuthMessage));
  }, [hasShownAuthMessage]);

  useEffect(() => {
    if (completedActions.objection && !hasShownObjectionMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          text: '',
          fullText: '이의제기 신청서가 잘 제출됐습니다! 다른 서류들도 제출해주세요.',
          typing: true,
          name: 'ChatBot'
        }
      ]);
      setHasShownObjectionMessage(true);
    }
  }, [completedActions.objection, hasShownObjectionMessage]);

  useEffect(() => {
    if (isAuthenticated && !hasShownAuthMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          text: '',
          fullText: '본인인증이 완료되었습니다.',
          typing: true,
          name: 'ChatBot'
        }
      ]);
      setHasShownAuthMessage(true);
    }
  }, [isAuthenticated, hasShownAuthMessage]);

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
    { title: '이의제기신청서', subtitle: '이의제기', path: '/objection', key: 'objection', message: '이의제기 신청서 작성해줘' },
    { title: '신분증 사본(필수)', subtitle: '신분증 발급', path: '/id-copy', key: 'idCopy', message: '신분증 사본 제출해줘' },
    { title: '본인서명', subtitle: '정부24에서', path: '/signature-verification', key: 'signatureVerification', message: '본인서명 사실확인서 제출해줘' },
    { title: '추가자료제출', subtitle: '내용', path: '/additional-data', key: 'additionalData', message: '추가 자료 제출해줘' },
  ];

  const handleActionClick = (message, path) => {
    const userMessage = { type: 'user', text: message, fullText: message, typing: false, name: 'User' };
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, userMessage];
      navigate(path);
      return newMessages;
    });
  };

  const handleResetMessages = () => {
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('hasShownObjectionMessage');
    localStorage.removeItem('hasShownAuthMessage');
    setMessages(initialMessage);
    setHasShownObjectionMessage(false);
    setHasShownAuthMessage(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const userMessage = { type: 'user', text: `파일 업로드: ${file.name}`, fullText: `파일 업로드: ${file.name}`, typing: false, name: 'User' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-icon">
          <img src={sendButtonIcon} alt="Chatbot Icon" />
        </div>
        <div className="chat-header-title">
          <h1>챗봇</h1>
          <span>@카카오뱅크</span>
        </div>
      </div>
      <div className="chat-body">
        <div className="chat-message bot">
          <div className="message">
            <p>금융거래 제한으로 불편함을 겪고 계신가요? 풀다챗에서 이의제기 서류를 빠르고 간편하게 준비하세요. 아래 필수 서류(이의제기 신청서, 신분증 사본, 본인서명사실확인서)를 제출하면, 실시간 알림을 받을 있습니다. 제출하시려면 본인인증을 먼저해야합니다!</p>
          </div>
        </div>
        <QuickActionButtons actions={quickActions} onActionClick={handleActionClick} />
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type}`}>
            <div className="message">
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <button onClick={() => resetAction('objection')}>이의제기신청서 리셋</button>
        <button onClick={() => resetAction('idCopy')}>신분증 리셋</button>
        <button onClick={() => resetAction('signatureVerification')}>본인서명 리셋</button>
        <button onClick={() => resetAction('additionalData')}>추가자료 리셋</button>
      </div>
      <div className="chat-footer">
        <label htmlFor="file-upload" className="file-upload-label">
          <img src={uploadIcon} alt="Upload Icon" />
        </label>
        <input 
          id="file-upload" 
          type="file" 
          style={{ display: 'none' }} 
          onChange={handleFileUpload} 
        />
        <input 
          type="text" 
          placeholder="궁금하신 내용을 입력해주세요." 
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleActionClick(event.target.value);
              event.target.value = '';
            }
          }}
        />
        <button 
          onClick={() => {
            const input = document.querySelector('.chat-footer input[type="text"]');
            handleActionClick(input.value);
            input.value = '';
          }}
        >
          <img src={sendButtonIcon} alt="Send Icon" />
        </button>
        <button onClick={handleResetMessages}>메시지 초기화</button>
      </div>
      <div className="navigation-bar">
        <button onClick={() => navigate('/objection-data-storage')}>
          <img src={objectionDataStorageIcon} alt="보관함" />
          <span>보관함</span>
        </button>
        <button onClick={() => navigate('/')}>
          <img src={chattingStartIcon} alt="채팅" />
          <span>채팅</span>
        </button>
        <button onClick={() => navigate('/previous-request')}>
          <img src={previousRequestIcon} alt="이전 내역" />
          <span>이전 내역</span>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
