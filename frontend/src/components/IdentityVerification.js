import React, { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from '../AuthContext';
import '../styles/IdentityVerification.css';

export default function IdentityVerification() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const { authenticate } = useAuth();

  useEffect(() => {
    // RecaptchaVerifier 초기화
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
        }
      });
    }
  }, []);

  const onSignInSubmit = () => {
    auth.languageCode = "ko"; // 한국어로 설정
    const appVerifier = window.recaptchaVerifier;
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        alert("OTP code sent to your phone.");
      })
      .catch((error) => {
        console.log("SMS FAILED", error);
        alert("Failed to send OTP. Please try again.");
      });
  };

  const handleSendCode = () => {
    onSignInSubmit();
  };

  const handleVerifyCode = () => {
    const code = otp; // OTP 입력 값
    if (window.confirmationResult) {
      window.confirmationResult.confirm(code)
        .then((result) => {
          const user = result.user;
          console.log("User signed in successfully", user);
          alert("User signed in successfully.");
          authenticate(); // 본인인증 완료 처리
        })
        .catch((error) => {
          console.error("Error signing in", error);
          alert("Failed to verify OTP. Please try again.");
        });
    } else {
      alert("Please request the OTP first.");
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith("0")) {
      return "+82" + phoneNumber.slice(1);
    }
    return phoneNumber;
  };

  return (
    <div className="identity-verification">
      <h1>본인인증 페이지</h1>
      <input
        type="text"
        placeholder="전화번호 입력"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div id="recaptcha-container"></div>
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
