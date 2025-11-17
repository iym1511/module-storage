'use client';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {useRouter} from "next/navigation";



function Login() {

    const router = useRouter();


    const [userInfo, setUserInfo] = useState<{email: string; password: string}>({email: '', password: ''});
    const [signUpInfo, setSignUpInfo] = useState<{
        email: string;
        password: string;
        name: string;
    }>({
        email: '',
        password: '',
        name: ''
    });

    const handleSignUpChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignUpInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSignInChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    }





    /* 회원가입 함수 */
    // const handleSignUp = async () => {
    //     try {
    //         const res = await fetch(`/ptc/signup`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(signUpInfo)
    //         });
    //
    //         const data = await res.json();
    //         console.log('회원가입 성공:', data)
    //     }catch(e: unknown) {
    //         console.error('회원가입 실패:', e);
    //     }
    // }
    const handleSignUp = async () => {
        try {
            console.log('📤 보내는 데이터:', signUpInfo); // ← 이거 확인!

            const res = await fetch(`/ptc/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpInfo)
            });

            console.log('📥 Status:', res.status);
            const data = await res.json();
            console.log('📥 응답:', data);

            if (res.ok) {
                alert('회원가입 성공!');
            } else {
                alert(`회원가입 실패: ${data.message}`);
            }
        } catch(e: unknown) {
            console.error('회원가입 실패:', e);
        }
    }


    const handleSignIn = async () => {
        try {
            const res = await fetch('/ptc/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            });
            console.log(res);
            router.push('/home');
        }catch (e: unknown) {
            console.error('로그인 실패:', e);
        }
    }



    return (
        <div>
            <h1>로그인 화면 입니다.ㅋㅋㅋㅋ</h1>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={handleSignInChange}
                        value={userInfo.email}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        PASSWORD
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={handleSignInChange}
                        value={userInfo.password}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleSignIn}
                >
                    로그인
                </button>
            </form>

            <h1>회원가입</h1>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        E-MAIL
                    </label>
                    <input
                        type="text"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={handleSignUpChange}
                        value={signUpInfo.email}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        NAME
                    </label>
                    <input
                        type="text"
                        name="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={handleSignUpChange}
                        value={signUpInfo.name}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        PASSWORD
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={handleSignUpChange}
                        value={signUpInfo.password}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleSignUp}
                >
                    회원가입
                </button>
            </form>
        </div>
    );
}

export default Login;