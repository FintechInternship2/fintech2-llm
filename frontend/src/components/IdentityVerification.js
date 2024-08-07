import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/IdentityVerification.css';

export default function IdentityVerification() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const { authenticate } = useAuth();
  const navigate = useNavigate(); // useNavigate 훅 사용

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
      authenticate(); // 본인인증 완료 처리
      navigate('/'); // 본인인증 후 메인 화면으로 이동
    } else {
      alert("유효한 6자리 OTP 코드를 입력해주세요.");
    }
  };

  return (
    <div className="identity-verification">
      <input
        type="text"
        placeholder="전화번호 입력"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleSendCode} id="sign-in-button">코드 전송</button>
      <input
        type="text"
        placeholder="OTP 입력"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyCode}>본인인증</button>
    </div>
  );
}
