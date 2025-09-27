"use client"

import { useAuthStore } from '@/services/store/useAuthStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import '@/app/globals.css'
import { useMutation } from '@tanstack/react-query';
import { forgetPassword, resetPassword, sendOtp } from '@/lib/api';
import { futimesSync } from 'fs';


function getToken() {
    return localStorage.getItem("accessToken");
}
function ForgetPassword() {

    const router = useRouter();
    const {
        emailOrPhone,
        username,
        password,
        email,
        phone,
        otp,
        otpSent,
        newPassword,
        setEmailOrPhone,
        setUsername,
        setPassword,
        setEmail,
        setPhone,
        setOtp,
        setOtpSent,
        resetAuth,
        saveToken,
    } = useAuthStore();

    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        return () => resetAuth();
    }, [resetAuth]);


    const SendOtpMutation = useMutation({
        mutationFn: () => forgetPassword({ emailOrPhone }),
        onSuccess: (data) => {
            if (data.success) {
                setMessage("OTP Sent! Check your email/phone.");
                setOtpSent(true);
            } else {
                setMessage("Failed to send OTP");
            }
        }
    })

    const handleSendOtp = () => SendOtpMutation.mutate();

    const verifyOtp = async () => {
        try {
            const data = await sendOtp({
                emailOrPhone: emailOrPhone,
                code: otp.join(""),
            });

            if (data.success) {
                saveToken(data.accessToken)
                setMessage("OTP Verified")
            } else {
                setMessage("Error verifying OTP");
            }
        }
        catch (err) {
            setMessage("Error verifying OTP");
        }
    }
    const handleResetPassword = async () => {
        try {
            let storedToken = await getToken();
            console.log(storedToken);

            if (!storedToken) {
                setMessage("Error No token found. Please verify OTP first")
                return;
            }

            const data = await resetPassword({
                emailOrPhone,
                token: storedToken,
                newPassword,
            });

            if (data.success) {
                setMessage("Password reset successfully!");
                router.push("/login");
            } else {
                setMessage("Failed to reset password");
            }
        }
        catch (err) {
            setMessage("Error while resetting password");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-[350px]  max-w-md  p-6 bg-black rounded-2xl shadow text-center border border-whitem text-white">
                <h1 className="text-2xl font-bold mb-2">AAO NI SA</h1>
                <p className="text-gray-500 mb-4">Reset your password using OTP</p>
                {message && <p className="text-red-500 mb-2">{message}</p>}
                <input type="text" placeholder='Phone Number or Email Address'
                    className='w-full mb-2 p-2 border rounded border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none' value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)} />

                {otpSent && (
                    <div className="flex gap-2 mb-2">
                        {otp.map((digit: string, index: number) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                className="w-12 p-2 border rounded text-center"
                                value={digit}
                                onChange={(e) => {
                                    const newOtp = [...otp];
                                    newOtp[index] = e.target.value;
                                    setOtp(newOtp);
                                }}
                            />
                        ))}
                    </div>
                )}

                <button className="w-full mt-1 mb-2 p-2  bg-[#00CFFF] text-white  rounded-xl "
                    onClick={handleSendOtp}
                    disabled={(SendOtpMutation as any).isLoading}
                >
                    {(SendOtpMutation as any).isLoading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                    Send Opt
                </button>

                <button className="w-full mt-1 mb-2 p-2  bg-[#00CFFF] text-white  rounded-xl "
                    onClick={verifyOtp}
                >
                    verify Otp
                </button>

                <input type="password" placeholder='Enter new password'
                    className='w-full mb-2 p-2 border rounded border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none' value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                <button className="w-full mt-2 mb-2 p-2  bg-[#00CFFF] text-white  rounded-4xl"
                    onClick={handleResetPassword}                >
                    Reset Password
                </button>


                <Link href="/auth/login" className="text-blue-500 text-sm">
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

export default ForgetPassword
