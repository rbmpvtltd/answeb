"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import { registerSchema } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/services/store/useAuthStore";
import { registerUser, verifyOtpRegisterUser } from "@/lib/api";

export default function Register() {
  const router = useRouter();
  const {
    emailOrPhone,
    username,
    password,
    otp,
    otpSent,
    setEmailOrPhone,
    setUsername,
    setPassword,
    setOtp,
    setOtpSent,
    resetAuth,
  } = useAuthStore();

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => resetAuth();
  }, [resetAuth]);

  // Mutation for sending OTP
  const sendOtpMutation = useMutation({
    mutationFn: () => registerUser({ emailOrPhone, username }),
    onSuccess: (data) => {
      if (data.success) {
        setOtpSent(true);

        setMessage("OTP Sent! Check your email/phone.");
      } else {
        setMessage(data.message);
      }
    },
    onError: () => setMessage("Failed to send OTP"),
  });

  // Mutation for verifying OTP & signup
  const signUpMutation = useMutation({
    mutationFn: () =>
      verifyOtpRegisterUser({
        emailOrPhone,
        username,
        password,
        otp: otp.join(""),
      }),
    onSuccess: (data) => {
      if (data.success) {
        setMessage("Account created successfully!");
        // resetAuth();
        router.push("/auth/login");
      } else {
        setMessage(data.message);
      }
    },
    onError: () => setMessage("Something went wrong"),
  });

  // const handleSendOtp = () => sendOtpMutation.mutate();
  const handleSendOtp = () => sendOtpMutation.mutate();

  const handleSignUp = () => {
    const validation = registerSchema.safeParse({
      emailOrPhone,
      username,
      password,
      otp: otp.join(""),
    });
    if (!validation.success) {
      setMessage(validation.error.issues[0].message);
      return;
    }
    signUpMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[350px] max-w-md p-6 bg-black rounded-2xl shadow text-center border-1 border-whitem text-white">
        <h1 className="text-2xl font-bold mb-2">AAO NI SA</h1>
        <p className="text-gray-500 mb-4">Sign up to see Videos from your friends.</p>

        {message && <p className="text-red-500 mb-2">{message}</p>}

        {/* Email or Phone */}
        <input
          type="text"
          placeholder="Phone Number or Email Address"
          className="w-full mb-2 p-2 border rounded border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />

        {/* OTP inputs */}
        {otpSent && (
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
                    !otp[index] && // agar current box khaali hai
                    index > 0 // aur first box nahi hai
                  ) {
                    const prevInput = document.getElementById(`otp-${index - 1}`);
                    prevInput?.focus();
                  }
                }}
              />
            ))}
          </div>
        )}



        <button
          className="w-full mt-1 mb-2 p-2 bg-[#00CFFF] text-white rounded"
          onClick={handleSendOtp}
          disabled={(sendOtpMutation as any).isLoading}
        >
          {(sendOtpMutation as any).isLoading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
        </button>

        {/* Username */}
        <input
          type="text"
          placeholder="User Name"
          className="w-full  mt-1 mb-2 p-2 border rounded border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Create Password"
          className="w-full mt-1 mb-2 p-2 border rounded   border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="text-gray-400 text-sm mb-4">
          By signing up, you agree to our Terms, Privacy Policy and Cookies Policy
        </p>

        <button
          className="w-full mb-4 p-2  bg-[#00CFFF] text-white rounded"
          onClick={handleSignUp}
          disabled={(signUpMutation as any).isLoading}
        >
          {(signUpMutation as any).isLoading ? "Signing Up..." : "Sign Up"}
        </button>

        <Link href="/auth/login" className="text-blue-500 text-sm">
          Have an account? Login
        </Link>
      </div>
    </div>
  );
}
