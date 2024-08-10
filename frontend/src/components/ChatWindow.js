import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickActionButtons from './QuickActionButtons';
import BeatLoader from 'react-spinners/BeatLoader'; // Import the BeatLoader
import sendButtonIcon from '../assets/icons/send_button.svg';
import uploadIcon from '../assets/icons/upload_icon.svg';
import objectionDataStorageIcon from '../assets/icons/objection_data_storage_icon.svg';
import previousRequestIcon from '../assets/icons/previous_request_icon.svg';
import chattingStartIcon from '../assets/icons/chatting_start_icon.svg';
import '../styles/ChatWindow.css';
import { useAuth } from '../AuthContext';
import { sendMessageToChatbot } from '../api/chatbot';
import { sendMessageToChatbot_procedure } from '../api/chatbot';
import { sendMessageToChatbot_document } from '../api/chatbot';
import { sendMessageToChatbot_call } from '../api/chatbot';
import { sendMessageToChatbot_prove_example } from '../api/chatbot';
import { sendMessageToChatbot_stop_example } from '../api/chatbot';

const ChatWindow = () => {
  const navigate = useNavigate();
  const initialMessage = [];

  const [loading, setLoading] = useState(false);

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

  const [hasShownIDCopyMessage, setHasShownIDCopyMessage] = useState(() => {
    const savedState = localStorage.getItem('hasShownIDCopyMessage');
    return savedState ? JSON.parse(savedState) : false;
  });

  const [hasShownSignatureMessage, setHasShownSignatureMessage] = useState(() => {
    const savedState = localStorage.getItem('hasShownSignatureMessage');
    return savedState ? JSON.parse(savedState) : false;
  });

  const [hasShownAdditionalDataMessage, setHasShownAdditionalDataMessage] = useState(() => {
    const savedState = localStorage.getItem('hasShownAdditionalDataMessage');
    return savedState ? JSON.parse(savedState) : false;
  });

  const { isAuthenticated, completedActions, resetAction } = useAuth();
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
    localStorage.setItem('hasShownIDCopyMessage', JSON.stringify(hasShownIDCopyMessage));
  }, [hasShownIDCopyMessage]);

  useEffect(() => {
    localStorage.setItem('hasShownSignatureMessage', JSON.stringify(hasShownSignatureMessage));
  }, [hasShownSignatureMessage]);

  useEffect(() => {
    localStorage.setItem('hasShownAdditionalDataMessage', JSON.stringify(hasShownAdditionalDataMessage));
  }, [hasShownAdditionalDataMessage]);

  useEffect(() => {
    if (completedActions.objection && !hasShownObjectionMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          text: '',
          fullText: '이의제기 신청서가 잘 제출됐습니다!',
          typing: true,
          name: 'ChatBot',
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
          name: 'ChatBot',
        }
      ]);
      setHasShownAuthMessage(true);
    }
  }, [isAuthenticated, hasShownAuthMessage]);

  useEffect(() => {
    if (completedActions.idCopy && !hasShownIDCopyMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          text: '',
          fullText: '신분증 사본 제출이 완료되었습니다!',
          typing: true,
          name: 'ChatBot',
        }
      ]);
      setHasShownIDCopyMessage(true);
    }
  }, [completedActions.idCopy, hasShownIDCopyMessage]);

  useEffect(() => {
    if (completedActions.signatureVerification && !hasShownSignatureMessage) {
      setMessages((prevMessages) => {
        if (!prevMessages.find(msg => msg.fullText === '본인서명사실확인서 제출이 완료되었습니다!')) {
          return [
            ...prevMessages,
            {
              type: 'bot',
              text: '',
              fullText: '본인서명사실확인서 제출이 완료되었습니다!',
              typing: true,
              name: 'ChatBot',
            }
          ];
        }
        return prevMessages;
      });
      setHasShownSignatureMessage(true);
    }
  }, [completedActions.signatureVerification, hasShownSignatureMessage]);

  useEffect(() => {
    if (completedActions.additionalData && !hasShownAdditionalDataMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          text: '',
          fullText: '추가 자료가 성공적으로 업로드되었습니다!',
          typing: true,
          name: 'ChatBot',
        }
      ]);
      setHasShownAdditionalDataMessage(true);
    }
  }, [completedActions.additionalData, hasShownAdditionalDataMessage]);

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
      }, 50); // 타이핑 속도 조절
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
    const userMessage = { 
        type: 'user', 
        text: message, 
        fullText: message, 
        typing: false, 
        name: 'User',
        isUserSystemMessage: true // 은희꺼랑 합칠 때 시스템 메세지 css 다르게 주는거 확인하기 
    };
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
    localStorage.removeItem('hasShownIDCopyMessage');
    localStorage.removeItem('hasShownSignatureMessage');
    localStorage.removeItem('hasShownAdditionalDataMessage');
    setMessages(initialMessage);
    setHasShownObjectionMessage(false);
    setHasShownAuthMessage(false);
    setHasShownIDCopyMessage(false);
    setHasShownSignatureMessage(false);
    setHasShownAdditionalDataMessage(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const userMessage = { type: 'user', text: `파일 업로드: ${file.name}`, fullText: `파일 업로드: ${file.name}`, typing: false, name: 'User' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    }
  };

  const handleSendMessage = async (message) => {
    // Trim the message to avoid issues with leading or trailing spaces
    const trimmedMessage = message.trim();
  
    const userMessage = { type: 'user', text: trimmedMessage, fullText: trimmedMessage, typing: false, name: 'User' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);
  
    try {
      let botResponse;
      if (trimmedMessage === '지급정지해제 절차') {
        const userprompt = '지급정지해제 절차에 대해서 알려드리겠습니다! 지급정지해제는 이의제기신청 서류접수 - 금융기관 확인 - 금융감독원 검토를 거쳐 수용결과가 안내됩니다. 서류 제출 후 검토까지 최대 2주 정도 소요될 수 있습니다. ';
        botResponse = await sendMessageToChatbot_procedure(trimmedMessage, userprompt);
      } 
      else if (trimmedMessage === '필요 서류 목록') {
        const userprompt = '이의제기 신청을 위해선 이의제기신청서 - 증빙자료 - 신분증 사본 - 본인서명사실확인서를 필수로 제출하세요';
        botResponse = await sendMessageToChatbot_document(trimmedMessage, userprompt);
      }
      else if (trimmedMessage === '상담원 안내') {
        botResponse = await sendMessageToChatbot_call(trimmedMessage);
      }
      else if (trimmedMessage === '증빙자료 예시') {
        botResponse = await sendMessageToChatbot_prove_example(trimmedMessage);
      }
      else if (trimmedMessage === '지급정지 피해사례') {
        botResponse = await sendMessageToChatbot_stop_example(trimmedMessage);
      }
      else {
        botResponse = await sendMessageToChatbot(trimmedMessage);
      }
      const formattedBotResponse = botResponse.replace(/\n/g, '<br>');
      const botMessage = { type: 'bot', text: '', fullText: formattedBotResponse, typing: true, name: 'ChatBot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false after the response is received
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
          <div 
            key={index} 
            className={`chat-message ${message.type} ${message.isUserSystemMessage ? 'system-message' : ''}`}
          >
            <div className="message">
              <p>{message.text}</p>
            </div>
          </div>
         ))} {/*퀵액션부터 여기까지가 은희꺼랑 합칠때 봐야하는ㄴ 부분 시스템 메시지 */}

        {loading && (
          <div className="chat-message bot">
            <div className="message">
              <BeatLoader color="#000" loading={true} size={10} margin={2} />
            </div>
          </div>
        )}
        {/* <button onClick={() => resetAction('objection')}>이의제기신청서 리셋</button>
        <button onClick={() => resetAction('idCopy')}>신분증 리셋</button>
        <button onClick={() => resetAction('signatureVerification')}>본인서명 리셋</button>
        <button onClick={() => resetAction('additionalData')}>추가자료 리셋</button> 테스트하기 위해 각 자료 리셋하렴 주석풀기! */}
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
              handleSendMessage(event.target.value);
              event.target.value = '';
            }
          }}
        />
        <button 
          onClick={() => {
            const input = document.querySelector('.chat-footer input[type="text"]');
            handleSendMessage(input.value);
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
