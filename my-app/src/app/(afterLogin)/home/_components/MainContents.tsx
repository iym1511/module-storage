'use client';
import React, {useEffect, useState} from 'react';

import {apiTest, UserType} from "../../../../fetchData/fetch-get";


function MainContents() {

    const [ary, setAry] = useState<UserType[] | null>();


    const fetchData = async () => {
        const result = await apiTest();
        setAry(result); // ✅ 결과를 state에 반영
    };

    const 리프래시토큰재발급 = async () => {
        // await refreshAccessToken();
    }

    useEffect(() => {
        fetchData();
    },[]);

    return (
        <div>
            3시30분 제일전기
            <h1>홈 페이지입니다~</h1>
            <button onClick={리프래시토큰재발급}>리프래시 토큰 발급</button>
            {ary?.map((item, index) => (
                <div key={index}>
                    <h3>{item.id}</h3>
                    <p>{item.name}</p>
                </div>
            ))}
        </div>
    );
}

export default MainContents;