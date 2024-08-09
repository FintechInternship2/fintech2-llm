import React, { useState, useEffect } from 'react';
import '../styles/ObjectionForm.css';
import addressLookupIcon from '../assets/icons/address_lookup_icon.svg'; // 주소 검색 아이콘
import { useAuth } from '../AuthContext'; // AuthContext 파일의 실제 경로를 사용하세요
import { useNavigate } from 'react-router-dom'; // react-router-dom의 useNavigate 훅을 사용하여 페이지 이동
import closeIcon from '../assets/icons/close.svg'; // Ensure the correct close icon is used
import infoIcon from '../assets/icons/type_of_account_icon.svg';

const ObjectionForm = () => {
  const { completeAction } = useAuth(); // AuthContext에서 completeAction 함수를 가져옴
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동
  const [formData, setFormData] = useState({
    name: '풀다봇',
    birthDate: '1999.12.12.',
    mobileNumber: '010',
    phoneNumber: '12345678',
    email: '',
    address: '',
    bankName: '인터넷은행A',
    storeName: '입출금통장',
    titleHolder: '',
    accountNumber: '',
    objectionReason: '',
    objectionAgreed: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const toggleTooltip = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  useEffect(() => {
    // Listen for messages from the popup
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      const { data } = event;
      if (data.startsWith('주소:')) {
        const address = data.split('주소:')[1];
        setFormData((prevFormData) => ({
          ...prevFormData,
          address,
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData(newFormData);
    localStorage.setItem('objectionFormData', JSON.stringify(newFormData));
  };

  const isPageComplete = () => {
    const pageFields = {
      1: ['name', 'birthDate', 'mobileNumber', 'email', 'address'],
      2: ['bankName', 'storeName', 'titleHolder', 'accountNumber'],
      3: ['objectionReason', 'objectionAgreed'],
    };
    return pageFields[currentPage].every(field => formData[field]);
  };

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isPageComplete()) {
      const fileData = JSON.stringify(formData, null, 2);
      const blob = new Blob([fileData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'form_data.json';
      a.click();
      URL.revokeObjectURL(url);

      completeAction('objection');
      alert('이의제기 신청서가 잘 제출됐습니다! 다른 서류들도 제출해주세요.');
      navigate('/');
    } else {
      alert("모든 필드를 작성해 주세요.");
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
      <div className="of-header">
        <div className="of-header-title">이의제기 신청서 ({currentPage}/3)</div>
        <button className="close-button" onClick={() => navigate('/')}>
          <img src={closeIcon} alt="Close" />
        </button>
      </div>
      <div className="form-container">
        <form className="objection-form">
          {currentPage === 1 && (
            <>
              <h2>신청인 정보</h2>
              <label>
                 성명
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="gray-background" />
              </label>
              <label>
                생년월일
                <input type="text" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="YYYY.MM.DD" required className="gray-background" />
              </label>
              <label>
                연락처
                <div className="phone-number">
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="010" required className="mobileNumber gray-background" />
                  <span>-</span>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="phoneNumber gray-background" />
                </div>
              </label>
              <label>
                이메일
                <input type="email" name="email" placeholder='pullda@pull.com' value={formData.email} onChange={handleChange} required />
              </label>
              <label className="address-label"> 주소 <span>(우편수령가능주소 기재)</span>
                <div className="address-input">
                  <input type="text" name="address" placeholder='지번, 도로명, 건물명으로 검색' value={formData.address} onChange={handleChange} required />
                  <button type="button" onClick={openPostcodePopup}>
                    <img src={addressLookupIcon} alt="주소 검색" />
                  </button>
                </div>
              </label>
            </>
          )}
          {currentPage === 2 && (
            <>
              <h2>지급정지계좌</h2>
              <label>
                 금융회사
                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} required className='gray-background' />
              </label>
              <label className="form-label-with-tooltip">
            예금종별 <img src={infoIcon} alt="Info Icon" className="info-icon" onClick={toggleTooltip} />
            <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required className="gray-background" />
            {isTooltipVisible && (
              <div className="tooltip">
                ‘예금종별’이란 가입하신 예금의 상품명을 의미합니다.
              </div>
            )}
          </label>
              <label>
                 명의인
                <input type="text" name="titleHolder" placeholder='계좌 명의인 성함 입력' value={formData.titleHolder} onChange={handleChange} required />
              </label>
              <label>
                 계좌번호
                <input type="text" name="accountNumber" placeholder='- 없이 14자리 입력' value={formData.accountNumber} onChange={handleChange} required />
              </label>
            </>
          )}
          {currentPage === 3 && (
  <>
    <h2>이의제기 사유</h2>
    <label>
      <textarea name="objectionReason" placeholder="구체적 사건 경위 및 상황 설명 시, 이의제기 신청 인용 확률이 높아져요."
        value={formData.objectionReason} onChange={handleChange} required className="objection-reason-textarea" />
    </label>
    <label className="checkbox-container">
      <div className="objection-confirmation-title">
        <h2>이의제기신청 내용 확인<span class="required">*</span></h2>
        <input type="checkbox" name="objectionAgreed" checked={formData.objectionAgreed} onChange={handleChange} className='objection-check'/>
        <span>동의함</span>
      </div>
      <div className="objection-confirmation-content">
        <p>
          「전기통신금융사기 피해 방지 및 피해금 환급에 관한 특별법」 제7조 제1항 및 같은 법 시행령 제7조에 따라 본인의 계좌에 대한 지급정지, 전자금융거래 제한 또는 채권소멸절차에 대하여 위와 같이 이의제기를 신청합니다.
        </p>
        <div className="checkbox-label">
          
        </div>
      </div>
    </label>
  </>
)}

        </form>
      </div>
      <div className="of-footer">
        <button type="button" onClick={handleNext} className="of-footer-button" disabled={!isPageComplete()}>
          {currentPage < 3 ? '다음' : '작성완료'}
        </button>
      </div>
    </div>
  );
};

export default ObjectionForm;
