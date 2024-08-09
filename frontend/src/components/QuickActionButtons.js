import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import checkFilledIcon from '../assets/icons/check_filled.svg';
import checkOutlineIcon from '../assets/icons/check_outline.svg';
import '../styles/QuickActionButtons.css';

const QuickActionButtons = ({ actions, onActionClick }) => {
  const { isAuthenticated, completedActions } = useAuth();
  const navigate = useNavigate();
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

  const handleActionClick = (message, path) => {
    if (isAuthenticated) {
      onActionClick(message, path);
    } else {
      navigate('/verify');
    }
  };

  return (
    <div className="quick-action-buttons">
      <span className="quick-action-title">⚡ 빠르게 지급제한 해제하기</span>
      <div className="quick-action-slider">
      {actions.map((action, index) => (
          <div
            className="quick-action-button"
            key={index}
            onClick={() => handleActionClick(action.message, action.path)}
          >
            <div className="quick-action-icon">
              <img src={completedActions[action.key] ? checkFilledIcon : checkOutlineIcon} alt="Check Icon" />
            </div>
            <div className="quick-action-text">
              <strong>{action.title}</strong>
              <span>{action.subtitle}</span>
            </div>
          </div>
        ))}
      {/* {sortedActions.map((action, index) => (
          <div
            className="quick-action-button"
            key={index}
            onClick={() => handleActionClick(action.message, action.path)}
          >
            <div className="quick-action-icon">
              <img src={completedActions[action.key] ? checkFilledIcon : checkOutlineIcon} alt="Check Icon" />
            </div>
            <div className="quick-action-text">
              <strong>{action.title}</strong>
              <span>{action.subtitle}</span>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default QuickActionButtons;
