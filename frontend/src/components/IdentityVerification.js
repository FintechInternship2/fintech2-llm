import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/IdentityVerification.css';

export default function IdentityVerification() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const { authenticate } = useAuth();
  const navigate = useNavigate();

  const handleSendCode = () => {
    if (!phoneNumber) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    alert("OTP 코드가 전송되었습니다. (임의의 6자리 숫자를 입력하세요)");
  };

  const handleVerifyCode = () => {
    if (otp.length === 6) {
      alert("본인인증이 완료되었습니다.");
      authenticate();
      navigate('/');
    } else {
      alert("유효한 6자리 OTP 코드를 입력해주세요.");
    }
  };

  return (
    <div className="identity-verification">
      <header className="iv-header">
        <p>간편인증</p>
        <button className="iv-close-button" onClick={() => navigate(-1)}>✕</button>
      </header>
      <div className="input-group-container1">
        <label className="input-label">연락처</label>
        <div className="input-group1">
          <input type="text" placeholder="- 없이 숫자만 입력" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <button onClick={handleSendCode} className="send-code-button" disabled={!phoneNumber}>
            인증번호 발송
          </button>
        </div>
      </div>
      <div className="input-group-container2">
        <label className="input-label">OTP 입력</label>
        <div className="input-group2">
          <input
            type="text"
            placeholder="인증번호 6자리 입력"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
      </div>
      <button onClick={handleVerifyCode} className="verify-button" disabled={otp.length !== 6}>
        인증 완료
      </button>
    </div>
  );
}
