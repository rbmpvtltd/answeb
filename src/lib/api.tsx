import { LoginInput, RegisterInput } from '@/schemas/auth';
import axios from 'axios';
import { createApiUrl } from './utils';

const getToken = async () => {
    return localStorage.getItem("accessToken");

};
const registerUser = async (data: Pick<RegisterInput, "emailOrPhone" | "username">) => {
    const config = {
        headers: { "Content-Type": "application/json" }
    };

    const apiUrl = createApiUrl("/api/users/register-check");
    console.log("Calling:", apiUrl, data);
    const res = await axios.post(apiUrl, data, config);

    return res.data;
}

async function verifyOtpRegisterUser(data: RegisterInput) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const apiUrl = createApiUrl('/api/users/verify-otp-and-register');
    const res = await axios.post(apiUrl, data, config);
    return res.data;
}

async function loginUser(data: LoginInput) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };

    const apiUrl = createApiUrl('/api/users/login');
    console.log("Calling:", apiUrl, data);    
    const res = await axios.post(apiUrl, data, config);
    return res.data;
    
}

async function forgetPassword(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const apiUrl = createApiUrl('/api/users/forgot-password');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}

async function sendOtp(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const apiUrl = createApiUrl('/api/users/verify-otp');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}


async function resetPassword(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const body = reqBody;
    const apiUrl = createApiUrl('/api/users/reset-password');
    const { data } = await axios.post(apiUrl, body, config);
    return data;
}


// 1️⃣ Send OTP for updating email
async function updateEmailSendOtp(reqBody: any) {
    const token = await getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            withCredentials: true
        },
    };
    const apiUrl = createApiUrl('/users/update-email-send-otp');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}

// 2️⃣ Send OTP for updating phone
async function updatePhoneSendOtp(reqBody: any) {
    const token = await getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            withCredentials: true
        },
    };
    const apiUrl = createApiUrl('/users/update-phone-send-otp');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}

// 3️⃣ Update user email (after OTP verification)
async function updateUserEmail(reqBody: any) {
    const token = await getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            withCredentials: true
        },
    };
    const apiUrl = createApiUrl('/users/update-user-email');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}

// 4️⃣ Update user phone (after OTP verification)
async function updateUserPhone(reqBody: any) {
    const token = await getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            withCredentials: true
        },
    };
    const apiUrl = createApiUrl('/users/update-user-phone');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}

async function getUserInfoAndFollowState() {
    const token = await getToken();
    console.log(token);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            withCredentials: true
        },
    };
    const apiUrl = createApiUrl('/follow/get-follow-state-and-userInfo');
    const { data } = await axios.post(apiUrl, {}, config);
    return data;
}
export { forgetPassword, getUserInfoAndFollowState, loginUser, registerUser, resetPassword, sendOtp, updateEmailSendOtp, updatePhoneSendOtp, updateUserEmail, updateUserPhone, verifyOtpRegisterUser };

