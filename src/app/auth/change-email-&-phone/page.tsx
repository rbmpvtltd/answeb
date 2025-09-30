"use client";

import { useAuthStore } from '@/services/store/useAuthStore';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react'
import '@/app/globals.css'
import { useMutation } from '@tanstack/react-query';
import { updateEmailSendOtp, updatePhoneSendOtp, updateUserEmail, updateUserPhone } from '@/lib/api';
function ChangeEmailOrPhone() {
  const router = useRouter();
  const {
    emailOrPhone,
    username,
    password,
    email,
    phone,
    otp,
    otpSent,
    emailOtpSent,
    phoneOtpSent,
    setEmailOrPhone,
    setUsername,
    setPassword,
    setEmail,
    setPhone,
    setEmailOtpSent,
    setPhoneOtpSent,
    setOtp,
    setOtpSent,
    resetAuth,
  } = useAuthStore();

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => resetAuth();
  }, [resetAuth]);


const sendOtpEmailMutation = useMutation({
  mutationFn: () => updateEmailSendOtp({ email }),
  onSuccess: (data) => {
    if (data.success) {
      setMessage("OTP Sent! Check your email.");
      setEmailOtpSent(true);
    }
  },
  onError: () => {
    setMessage("Error sending OTP. Please try again.");
  }})
  
  const handelSendOtpEmail = () => sendOtpEmailMutation.mutate();
const verifyOtpEmail = async () => {
  try {
    const data = await updateUserEmail({ email: email, otp: otp.join("") });
    if (data.success) {
      setMessage("OTP Verified")
    } else {
      setMessage("Error verifying OTP");
    }
  }
  catch (err) {
    setMessage("Error verifying OTP");
  }
    resetAuth()
}

const sendOtpPhoneMutation = useMutation({
  mutationFn: () => updatePhoneSendOtp({ phone }),
  onSuccess: (data) => {
    if (data.success) {
      setMessage("OTP Sent! Check your phone.");
      setPhoneOtpSent(true);
    }
  },
  onError: () => {
    setMessage("Error sending OTP. Please try again.");
}})

const handelSendOtpPhone =  () => sendOtpPhoneMutation.mutate()
const verifyOtpPhone = async () => {
  try {
    const data = await updateUserPhone({ phone: phone, otp: otp.join("") });
    if (data.success) {
      setMessage("OTP Verified")
    } else {
      setMessage("Error verifying OTP");
    }
  }
  catch (err) {
    setMessage("Error sending OTP. Please try again.");
  }
  resetAuth()
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[350px]  max-w-md  p-6 bg-black rounded-2xl shadow text-center border border-whitem text-white">
        <h1 className="text-2xl font-bold mb-2">AAO NI SA</h1>
        <p className="text-gray-500 mb-4">Change Email and Phone Number</p>
        {message && <p className="text-red-500 mb-2">{message}</p>}
        <input type="text" placeholder='Enter your email'
          className='w-full mb-2 p-2 border rounded border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none' value={email}
          onChange={(e) => setEmail(e.target.value)} />

         {/* OTP inputs */}
                {emailOtpSent && (
                    <div className="flex gap-1 mb-2">
                        {otp.map((digit: string, index: number) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                className="w-12 p-2 border rounded text-center"
                                value={digit}
                                id={`otp-${index}`}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const newOtp = [...otp];
                                    newOtp[index] = value;
                                    setOtp(newOtp);

                                    // Forward focus (next input)
                                    if (value && index < otp.length - 1) {
                                        const nextInput = document.getElementById(`otp-${index + 1}`);
                                        nextInput?.focus();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Backspace" &&
                                        !otp[index] &&
                                        index > 0
                                    ) {
                                        const prevInput = document.getElementById(`otp-${index - 1}`);
                                        prevInput?.focus();
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}


        {emailOtpSent ? (
          <button className="w-full mt-2 mb-2 p-2  bg-[#00CFFF] text-white  rounded-xl
                 "
           onClick={verifyOtpEmail}
          >
            Verify OTP
          </button>
        ) : (
          <button className="w-full mt-2 mb-2 p-2  bg-[#00CFFF] text-white  rounded-xl"
           onClick={handelSendOtpEmail}
            disabled={(sendOtpEmailMutation as any).isLoading}
          >
            Send OTP
          </button>
        )}

        <input type="text" placeholder='Enter your phone number'
          className='w-full mb-2 p-2 border rounded border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none' value={phone}
          onChange={(e) => setPhone(e.target.value)} />

        {/* OTP inputs */}
        {phoneOtpSent && (
          <div className="flex gap-1 mb-2">
            {otp.map((digit: string, index: number) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 p-2 border rounded text-center"
                value={digit}
                id={`otp-${index}`}
                autoComplete="off"
                onChange={(e) => {
                  const value = e.target.value;
                  const newOtp = [...otp];
                  newOtp[index] = value;
                  setOtp(newOtp);

                  // Forward focus (next input)
                  if (value && index < otp.length - 1) {
                    const nextInput = document.getElementById(`otp-${index + 1}`);
                    nextInput?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    !otp[index] &&
                    index > 0
                  ) {
                    const prevInput = document.getElementById(`otp-${index - 1}`);
                    prevInput?.focus();
                  }
                }}
              />
            ))}
          </div>
        )}

        {phoneOtpSent ? (
          <button className="w-full mt-2 mb-2 p-2  bg-[#00CFFF] text-white  rounded-xl
                 "
           onClick={verifyOtpPhone}
          >
            Verify OTP
          </button>
        ) : (
          <button className="w-full mt-2 mb-2 p-2  bg-[#00CFFF] text-white  rounded-xl
                 "
           onClick={handelSendOtpPhone}
            disabled={(sendOtpPhoneMutation as any).isLoading}
          >
            Send OTP
          </button>
        )}


        <Link href="/auth/login" className="text-blue-500 text-sm">
          Back to Login
        </Link>
      </div>
    </div>
  )
}

export default ChangeEmailOrPhone
