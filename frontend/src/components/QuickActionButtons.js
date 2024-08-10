import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import checkFilledIcon from '../assets/icons/check_filled.svg';
import checkOutlineIcon from '../assets/icons/check_outline.svg';
import quickIcon from '../assets/icons/quick_action.svg';
import rectIcon from '../assets/icons/rectangular.svg';
import rectcheckIcon from '../assets/icons/rectangular_check.svg';
import '../styles/QuickActionButtons.css';

const QuickActionButtons = ({ actions, onActionClick }) => {
  const { isAuthenticated, completedActions } = useAuth();
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState(null); // useState 사용

  // const [sortedActions, setSortedActions] = useState(actions); //은히랑 합칠 때 추가

  // useEffect(() => {
  //   // Move completed actions to the end of the list
  //   const sorted = [...actions].sort((a, b) => {
  //     const isACompleted = !!completedActions[a.key];
  //     const isBCompleted = !!completedActions[b.key];
  //     return isACompleted - isBCompleted;
  //   });
  //   setSortedActions(sorted);
  // }, [actions, completedActions]); //은히랑 합칠 때 추가 아래도 sorted actions.map 부터 quick-action-text까지

  const handleActionClick = (message, path, actionKey) => { // actionKey로 파라미터 이름 변경
    setSelectedAction(actionKey); // 클릭된 버튼의 key를 상태로 저장
    if (isAuthenticated) {
      onActionClick(message, path);
    } else {
      navigate('/verify');
    }
  };

  return (
    <div className="quick-action-buttons">
      <span className="quick-action-title"><img src={quickIcon} alt="Quick Action" />지급제한 해제 필수 서류 제출하기</span>
      <div className="quick-action-slider">
        {actions.map((action, index) => (
          <div
            className={`quick-action-button ${action.key === selectedAction ? 'selected' : ''} ${action.key === 'signatureVerification' ? 'wide-button' : ''}`}
            key={index}
            onClick={() => handleActionClick(action.message, action.path, action.key)} // action.key를 전달
          >
            <div className="quick-action-icon">
              <img src={completedActions[action.key] ? rectcheckIcon : rectIcon} alt="Check Icon" />
            </div>
            <div className="quick-action-text">
              <strong>{action.title}</strong>
              <span>{action.subtitle}</span> {/* 부제목이 제목 아래에 표시되도록 함 */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionButtons;