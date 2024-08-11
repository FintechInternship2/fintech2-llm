import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickActionButtons from './QuickActionButtons';
import BeatLoader from 'react-spinners/BeatLoader'; // Import the BeatLoader
import sendButtonIcon from '../assets/icons/send_button.svg';
import uploadIcon from '../assets/icons/upload_icon.svg';
import arrowIcon from '../assets/icons/arrow_icon.svg'; // 프로필 왼쪽 화살표 아이콘
import otherIcon from '../assets/icons/other_icon.svg'; // 프로필 더보기 아이콘
import messageIcon from '../assets/icons/message.svg'; // 메세지 아이콘
import plusIcon from '../assets/icons/plus.svg'; // 플러스 아이콘
import logoIcon from '../assets/icons/logo.svg'; // 플러스 아이콘
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
    { title: '이의제기신청서', subtitle: '앱 내에서 빠르게 작성하기', path: '/objection', key: 'objection', message: '이의제기 신청서 작성해줘' },
    { title: '신분증 사본', subtitle: '진위확인용 본인 신분증 첨부', path: '/id-copy', key: 'idCopy', message: '신분증 사본 제출해줘' },
    { title: '본인 서명사실확인서', subtitle: '정부24에서 파일 다운로드', path: '/signature-verification', key: 'signatureVerification', message: '본인서명 사실확인서 제출해줘' },
    { title: '증빙자료', subtitle: '재산 현황 및 성실성 증빙 자료', path: '/additional-data', key: 'additionalData', message: '추가 자료 제출해줘' },
  ];

  const handleActionClick = (message, path) => { 
    const userMessage = { 
        type: 'user', 
        text: message, 
        fullText: message, 
        typing: false, 
        name: 'User'
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
    console.log(message);
    const trimmedMessage = message.trim();
    const userMessage = { type: 'user', text: trimmedMessage, fullText: trimmedMessage, typing: false, name: 'User' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);
  
    try {
      let botResponse;
      if (trimmedMessage === '지급정지해제 절차') {
        const userprompt = '지급정지해제를 위한 이의제기 신청 절차는 필수 서류 작성, 서류접수, 금융기관 확인, 금융감독원 검토를 이후 결과 알려드립니다. 승인 완료 시, 1시간 이내 지급정지가 정상적으로 해제됩니다. ';
        botResponse = await sendMessageToChatbot_procedure(trimmedMessage, userprompt);
      } 
      else if (trimmedMessage === '필요 서류 목록') {
        const userprompt = '이의제기 신청을 위해선 이의제기신청서 - 증빙자료 - 신분증 사본 - 본인서명사실확인서를 필수로 제출하세요. ';
        botResponse = await sendMessageToChatbot_document(trimmedMessage, userprompt);
      }
      else if (trimmedMessage === '고객센터 연결') {
        const userprompt = '사고 신고 접수 카카오뱅크 고객센터 운영시간을 안내해드리겠습니다. 유선연락: 1599-8888 운영시간: 365일 24시간 - \'지급해제 정지\' 관련 접수는 주말 중에도 가능합니다. 그러나 해제 절차는 은행 영업 시간 내에만 가능합니다. ';
        botResponse = await sendMessageToChatbot_call(trimmedMessage, userprompt);
      }
      else if (trimmedMessage === '증빙자료 예시') {
        const userprompt = '지급정지해제를 위한 증빙사례가 궁금하시다면, 대화창에 사례를 작성해주시거나 문서, 파일을 첨부해주시면 비슷한 사례를 알려드려요. 텍스트, PDF, JPG 형태의 파일만 첨부가능합니다. ';
        botResponse = await sendMessageToChatbot_prove_example(trimmedMessage, userprompt);
      }
      else if (trimmedMessage === '지급정지 피해사례') {
        const userprompt = '지급정지는 은행이나 금융 기관이 고객의 계좌에서 특정 거래를 차단하거나 보류하는 것을 말합니다.고객이 사기, 도난 또는 기타 의심스러운 활동에 연루되었다고 판단될 경우 지급정지가 될 수 있습니다. 최근 \'지급정지\' 제도를 악용한 신종 보이스피싱 사기로 인해 무관한 고객의 계좌가 지급정지되는 경우가 있습니다. 지급 정지 계좌는 모든 금융거래가 제한되어 청구서 납부, 직불카드 사용, 자동이체 등을 할 수 없습니다. 따라서 신속하게 은행 고객센터에 이의제기신청서를 제출해야 합니다. ';
        botResponse = await sendMessageToChatbot_stop_example(trimmedMessage, userprompt);
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
        <div className="chat-header-title">
          <img className="chat-arrow-icon" src={arrowIcon} alt="Arrow Icon" /> 
          <img className="chat-header-icon" src={logoIcon} alt="Chatbot Icon" /> 
          <h1>풀다챗</h1> 
          <div className="chat-other">
            <img className="chat-other-icon" src={otherIcon} alt="Other Icon" />  
          </div>
        </div>
      </div>

      <div className="chat-body">
        <div className='chat-date'>
          <div className='date'>
            <p>8월 11일</p>
          </div>
        </div>
        <div className="chat-message bot">
          <div className="message">
            <p>금융거래 제한으로 불편함을 겪고 계신가요? ‘풀다챗'에서 이의제기 서류를 빠르고 간편하게 준비하세요. 아래 필수 서류(이의제기 신청서, 신분증 사본, 본인서명사실확인서)를 제출하면, 실시간 알림을 받을 수 있어요!</p>
          </div>
        </div>

             {/* Quick Action Buttons */}
             <QuickActionButtons actions={quickActions} onActionClick={handleActionClick} />
        
        {/* Quick Buttons - Moved below QuickActionButtons */}
        <div className="quick-buttons">
            <button className="quick-button" onClick={() => handleSendMessage('지급정지해제 절차')}>
              지급정지해제 절차
            </button>
            <button className="quick-button" onClick={() => handleSendMessage('필요 서류 목록')}>
             필요 서류 목록
            </button>
           <button className="quick-button" onClick={() => handleSendMessage('고객센터 연결')}>
              고객센터 연결
            </button>
            <button className="quick-button" onClick={() => handleSendMessage('증빙자료 예시')}>
              증빙자료 예시
            </button>
            <button className="quick-button" onClick={() => handleSendMessage('지급정지 피해사례')}>
              지급정지 피해사례
            </button>
          </div>

          {messages.map((message, index) => (
           <div key={index} className={`chat-message ${message.type}`}>
            <div className="message">
              <p>{message.text}</p>
             </div>
           </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="message_loading">
              <BeatLoader color="#000" loading={true} size={10} margin={2} />
            </div>
          </div>
        )}
      </div>
        {/* <button onClick={() => resetAction('objection')}>이의제기신청서 리셋</button>
        <button onClick={() => resetAction('idCopy')}>신분증 리셋</button>
        <button onClick={() => resetAction('signatureVerification')}>본인서명 리셋</button>
        <button onClick={() => resetAction('additionalData')}>추가자료 리셋</button>  */}
      <div className="chat-footer">
        <div className="chat-footer-container">
          <label htmlFor="file-upload" className="file-upload-label">
           <img src={plusIcon} alt="Upload Icon" />
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
              const input = document.querySelector('.chat-footer-container input[type="text"]');
             handleSendMessage(input.value);
             input.value = '';
            }}>
           <img src={sendButtonIcon} alt="Send Icon" />
          </button>
        </div>
      </div>


      {/* <button onClick={handleResetMessages}>메시지 초기화</button> */}


      <div className="navigation-bar">
        <button onClick={() => navigate('/objection-data-storage')}>
          <img src={objectionDataStorageIcon} alt="보관함" />
          <span>보관함</span>
        </button>
        <button onClick={() => navigate('/')}>
          <img src={messageIcon} alt="채팅" />
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