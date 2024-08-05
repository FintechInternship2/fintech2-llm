import React from 'react';
import checkFilledIcon from '../assets/icons/check_filled.svg';
import checkOutlineIcon from '../assets/icons/check_outline.svg';
import '../styles/QuickActionButtons.css';

const QuickActionButtons = ({ actions, completedActions, onActionClick }) => {
  return (
    <div className="quick-action-buttons">
      <span className="quick-action-title">⚡ 빠르게 지금제한 해제하기</span>
      <div className="quick-action-slider">
        {actions.map((action, index) => (
          <div
            className="quick-action-button"
            key={index}
            onClick={() => onActionClick(action.title)}
          >
            <div className="quick-action-icon">
              <img src={completedActions.includes(action.title) ? checkFilledIcon : checkOutlineIcon} alt="Check Icon" />
            </div>
            <div className="quick-action-text">
              <strong>{action.title}</strong>
              <span>{action.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionButtons;