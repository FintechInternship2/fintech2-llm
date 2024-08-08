import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/ObjectionStoragePage.css';
import GoBackIcon from '../assets/icons/goback_icon.svg'; // Import the custom icon

const ObjectionStoragePage = () => {
  const navigate = useNavigate();
  const { completedActions, submitDocuments } = useAuth(); // Import the necessary functions

  const documents = [
    {
      name: '이의제기신청서',
      completed: completedActions.objection,
      route: '/edit-objection',
      id: '00100341',
      date: '2024-08-08',
    },
    {
      name: '신분증사본',
      completed: completedActions.idCopy,
      route: '/edit-id-copy',
      id: '00100341',
      date: '2024-08-08',
    },
    {
      name: '본인서명사실확인서',
      completed: completedActions.signatureVerification,
      route: '/edit-signature-verification',
      id: '00100341',
      date: '2024-08-08',
    },
    {
      name: '증빙자료(선택)',
      completed: completedActions.additionalData,
      route: '/edit-additional-data',
      id: '00100341',
      date: '2024-08-08',
    },
  ];

  const incompleteDocuments = documents.filter(doc => doc.completed === false);
  const completedDocuments = documents.filter(doc => doc.completed === true);
  const submittedDocuments = documents.filter(doc => doc.completed === 'submitted');

  const allDocumentsSubmitted = documents.every(doc => doc.completed === true);

  const handleSubmit = () => {
    if (allDocumentsSubmitted) {
      alert("서류가 정상적으로 접수되었습니다!");
      submitDocuments(); // Call the submitDocuments function
      navigate('/previous-request');
    } else {
      alert("필수 서류를 제출해주세요");
    }
  };

  return (
    <div className="objection-storage-page" style={{ height: '650px' }}>
      <header className="header">
        <button className="back-button" onClick={() => navigate('/')}>
          <img src={GoBackIcon} alt="Go back" className="back-icon" />
        </button>
        <h1 className="title">보관함</h1>
        <div className="spacer"></div>
      </header>
      <div className="status-header">
        <span className="status-title">미작성 {incompleteDocuments.length}</span>
        <span className="status-title">작성중 {completedDocuments.length}</span>
        <span className="status-title">제출됨 {submittedDocuments.length}</span>
      </div>
      <hr className="separator" />
      <div className="container">
        <section className="documents-section">
          <ul>
            {incompleteDocuments.map(doc => (
              <li key={doc.name} className={`document-item not-started`}>
                <div className="document-info">
                  <span className="document-status">
                    미작성
                  </span>
                  <span className="document-title">{doc.name}</span>
                </div>
                <button className="action-button" onClick={() => navigate(doc.route)}>수정</button>
              </li>
            ))}
            {completedDocuments.map(doc => (
              <li key={doc.name} className={`document-item completed`}>
                <div className="document-info">
                  <span className="document-status">
                    완료 · {doc.date}
                  </span>
                  <span className="document-title">{doc.name}</span>
                  <span className="document-id">서류 번호: {doc.id}</span>
                </div>
                <button className="action-button" onClick={() => navigate(doc.route)}>수정</button>
              </li>
            ))}
            {submittedDocuments.map(doc => (
              <li key={doc.name} className={`document-item submitted`}>
                <div className="document-info">
                  <span className="document-status">
                    제출됨 · {doc.date}
                  </span>
                  <span className="document-title">{doc.name}</span>
                  <span className="document-id">서류 번호: {doc.id}</span>
                </div>
                <button className="action-button" onClick={() => navigate(doc.route)}>수정</button>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={!allDocumentsSubmitted}
      >
        제출하기
      </button>
    </div>
  );
};

export default ObjectionStoragePage;
