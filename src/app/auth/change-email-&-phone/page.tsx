import { useAuthStore } from '@/services/store/useAuthStore';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react'
import '@/app/globals.css'
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
        setEmailOrPhone,
        setUsername,
        setPassword,
        setEmail,
        setPhone,
        setOtp,
        setOtpSent,
        resetAuth,
    } = useAuthStore();

    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        return () => resetAuth();
    }, [resetAuth]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-[350px]  max-w-md  p-6 bg-black rounded-2xl shadow text-center border border-whitem text-white">
                <h1 className="text-2xl font-bold mb-2">AAO NI SA</h1>
                <p className="text-gray-500 mb-4">Change Email and Phone Number</p>
                {/* {message && <p className="text-red-500 mb-2">{message}</p>} */}
                <input type="text" placeholder='Enter your email'
                    className='w-full mb-2 p-2 border rounded border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none' value={email}
                    onChange={(e) => setEmail(e.target.value)} />

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

                <button className="w-full mt-2 mb-2 p-2  bg-[#00CFFF] text-white  rounded-xl "
                //  onClick={handleSendOtp}
                //   disabled={(sendOtpMutation as any).isLoading}
                >
                    {/* {(sendOtpMutation as any).isLoading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"} */}
                    Send Opt
                </button>

                <input type="text" placeholder='Enter your phone number'
                    className='w-full mb-2 p-2 border rounded border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none' value={[phone]}
                    onChange={(e) => setPhone(e.target.value)} />

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

                <button className="w-full mt-2 mb-2 p-2  bg-[#00CFFF] text-white  rounded-xl
                 "
                //  onClick={handleSendOtp}
                //   disabled={(sendOtpMutation as any).isLoading}
                >
                    {/* {(sendOtpMutation as any).isLoading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"} */}
                    Send Opt

                </button>


                <Link href="/auth/login" className="text-blue-500 text-sm">
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

export default ChangeEmailOrPhone
