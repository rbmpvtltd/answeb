"use client";

import "@/app/globals.css";
import { loginUser } from "@/lib/api";
import { loginSchema } from "@/schemas/auth";
import { useAuthStore } from "@/services/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react'
function Login() {
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
    saveToken
  } = useAuthStore();

  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    return () => resetAuth();
  }, [resetAuth]);

  const usernameOrEmailOrPhone = emailOrPhone || username;
  const LoginMutation = useMutation({
    mutationFn: () => loginUser({ usernameOrEmailOrPhone, password }),
    onSuccess: (data) => {
      if (data.success) {
        setMessage("Logged In Successfully");
        resetAuth();
        saveToken(data.accessToken)
        router.push("/");
      }
    },
    onError: () => setMessage("Failed to login")
  })

  const handleLogin = () => {
    const usernameOrEmailOrPhone = emailOrPhone || username;
    
    const validation = loginSchema.safeParse({
      usernameOrEmailOrPhone,
      password
    })
    if (!validation.success) {
      setMessage(validation.error.issues[0].message)
      return
    }
    LoginMutation.mutate()
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[350px] max-w-md p-6 bg-black rounded-2xl shadow text-center border border-whitem text-white">
        <h1 className="text-2xl font-bold mb-2">AAO NI SA</h1>
        <p className="text-gray-500 mb-4">Sign up to see Videos from your friends.</p>

        {message && <p className="text-red-500 mb-2">{message}</p>}


        {/* Email, Username or Phone */}
        <input
          type="text"
          placeholder="Phone no , username or email address"
          className="w-full mb-2 p-2 border rounded border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mt-2 mb-2 p-2 border rounded border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

     <Link href="/auth/forget-password" className="text-blue-500 text-sm">
          Forget Password ?
        </Link>
        <button
          className="w-full mt-2 mb-2 p-2  bg-[#00CFFF] text-white  rounded-4xl"
        onClick={handleLogin}
        disabled={(LoginMutation as any).isLoading}
        >
          {(  LoginMutation as any).isLoading ? "Login ..." : "Login"}
        
        </button>


          <Link href="/auth/register" className="text-blue-500 text-sm">
          Have an account ? Sign up
        </Link>
      </div>
    </div>
  )
}

export default Login
