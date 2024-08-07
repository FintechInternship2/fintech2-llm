import React, { useState, useEffect } from 'react';
import '../styles/ObjectionForm.css';
import addressLookupIcon from '../assets/icons/address_lookup_icon.svg'; // 주소 검색 아이콘
import { useAuth } from '../AuthContext'; // AuthContext 파일의 실제 경로를 사용하세요
import { useNavigate } from 'react-router-dom'; // react-router-dom의 useNavigate 훅을 사용하여 페이지 이동

const ObjectionForm = () => {
  const { completeAction } = useAuth(); // AuthContext에서 completeAction 함수를 가져옴
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    mobileNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    bankName: '',
    storeName: '',
    titleHolder: '',
    accountNumber: '',
    objectionReason: '',
    objectionAgreed: false,
  });

  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('objectionFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    window.addEventListener('message', handlePostMessage);

    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  useEffect(() => {
    const checkFormComplete = () => {
      const values = Object.values(formData);
      for (let value of values) {
        if (value === '' || value === false) {
          setIsFormComplete(false);
          return;
        }
      }
      setIsFormComplete(true);
    };
    checkFormComplete();
  }, [formData]);

  const handlePostMessage = (event) => {
    if (event.data && typeof event.data === 'string' && event.data.startsWith('주소:')) {
      const address = event.data.replace('주소:', '');
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: address,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData(newFormData);
    localStorage.setItem('objectionFormData', JSON.stringify(newFormData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormComplete) {
      const fileData = JSON.stringify(formData, null, 2);
      const blob = new Blob([fileData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'form_data.json';
      a.click();
      URL.revokeObjectURL(url);
      
      completeAction('objection'); // completeAction 함수를 호출하여 objection을 true로 설정
      alert('이의제기 신청서가 잘 제출됐습니다! 다른 서류들도 제출해주세요.');
      navigate('/'); // 메인 화면으로 이동
    } else {
      alert("임시 저장되었습니다.");
    }
  };

  const openPostcodePopup = () => {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    window.open('/postcode-popup.html', '주소 검색', `width=${width},height=${height},left=${left},top=${top}`);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>이의제기 신청서</h1>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="objection-form" id="objection-form">
          <h2>신청인 정보</h2>
          <label>
            <span className="required">*</span> 성명:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="gray-background" />
          </label>
          <label>
            <span className="required">*</span> 생년월일:
            <input type="text" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="YYYY.MM.DD" required className="gray-background" />
          </label>
          <label>
            <span className="required">*</span> 휴대전화 번호:
            <div className="phone-number">
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="010-1234-5678" required />
            </div>
          </label>
          <label>
            <span className="required">*</span> 전화번호:
            <div className="phone-number">
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="031-1234-5678" required />
            </div>
          </label>
          <label>
            <span className="required">*</span> E-mail:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label className="address-label">
            <span className="required">*</span> 주소:
            <div className="address-input">
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
              <button type="button" onClick={openPostcodePopup}>
                <img src={addressLookupIcon} alt="주소 검색" />
              </button>
            </div>
          </label>
          <h2>지급정지계좌</h2>
          <label>
            <span className="required">*</span> 금융회사:
            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} required />
          </label>
          <label>
            <span className="required">*</span> 개설점포:
            <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required />
          </label>
          <label>
            <span className="required">*</span> 명의인:
            <input type="text" name="titleHolder" value={formData.titleHolder} onChange={handleChange} required />
          </label>
          <label>
            <span className="required">*</span> 계좌번호:
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="14자리 입력" required />
          </label>
          <h2>이의제기 사유</h2>
          <label>
            <span className="required">*</span> 이의제기 사유:
            <textarea name="objectionReason" value={formData.objectionReason} onChange={handleChange} required />
          </label>
          <label className="checkbox-container">
            <span className="required">*</span> 이의제기신청 내용 확인:
            <input type="checkbox" name="objectionAgreed" checked={formData.objectionAgreed} onChange={handleChange} required />
            동의함
          </label>
        </form>
      </div>
      <div className="footer">
        <button type="button" onClick={handleSubmit} className="footer-button">
          {isFormComplete ? '작성완료' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default ObjectionForm;
