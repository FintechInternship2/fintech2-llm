import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/ObjectionStoragePage.css';

const ObjectionStoragePage = () => {
  const navigate = useNavigate();
  const { completedActions } = useAuth(); // AuthContext에서 상태를 가져옴

  return (
    <div className="objection-storage-page">
      <header className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="title">보관함</h1>
      </header>
      <div className="container">
        <section className="progress-section">
          <h2>이의제기서류접수</h2>
          <p className="subtext">진행중이에요</p>
          <div className="progress-bar">
            <div className="progress-step active">1</div>
            <div className="progress-step">2</div>
            <div className="progress-step">3</div>
            <div className="progress-step">4</div>
          </div>
          <div className="progress-info">
            <div className="info-item">
              <h3>진행 중</h3>
              <p>1 건</p>
            </div>
            <div className="info-item">
              <h3>완료</h3>
              <p>0 건</p>
            </div>
            <div className="info-item">
              <h3>반려</h3>
              <p>0 건</p>
            </div>
          </div>
        </section>
        <section className="documents-section">
          <h3>나의 서류</h3>
          <ul>
            {completedActions.objection && (
              <li>
                xx은행 이의제기신청서
                <button className="action-button">수정하기</button>
                <span className="status">접수됨</span>
              </li>
            )}
            {completedActions.idCopy && (
              <li>
                신분증 사본
                <button className="action-button">수정하기</button>
                <span className="status">접수됨</span>
              </li>
            )}
            {completedActions.signatureVerification && (
              <li>
                본인서명사실확인서
                <button className="action-button">첨부하기</button>
                <span className="status">접수됨</span>
              </li>
            )}
            {completedActions.additionalData && (
              <li>
                증빙자료(선택)
                <button className="action-button">첨부하기</button>
                <span className="status">접수됨</span>
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ObjectionStoragePage;
