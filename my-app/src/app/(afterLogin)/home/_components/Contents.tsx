'use client';
import React, { useState } from 'react';
import Drawer from '@/components/Drawer';

export default function Contents() {
    const [tab, setTab] = useState('detail');

    // --------------------------
    // Drawer 상태
    // --------------------------
    const [drawer, setDrawer] = useState({
        isOpen: false,
        type: '', // "filter" | "date"
    });

    const [jsonData, setJsonData] = useState({
        flagType: 'gold',
        marketName: '삼겹살 맛집',
        marketLocation: '서울시 강남구 어딘가',
        marketLat: '37.1231',
        marketLng: '127.1231',
        marketMission1: true,
        marketMission2: true,
        marketMission2List: [
            { nickname: '치킨', name: '홍길동', tel: '010-1111-2222' },
            { nickname: '피자', name: '이상혁', tel: '010-3333-4444' },
            { nickname: '햄버거', name: '박철수', tel: '010-5555-6666' },
        ],
        marketMission3: false,
        marketMission3Count: 2,
        marketStartDate: '2024-01-01',
        marketCheckDate: '2024-07-01',
    });

    // --------------------------
    // 렌더링
    // --------------------------
    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* ---------------------- */}
            {/* 탭 */}
            {/* ---------------------- */}
            <ul className="flex w-full">
                <li
                    className={`flex-1 text-center py-4 cursor-pointer ${
                        tab === 'detail' ? 'font-bold border-b-2 border-blue-500' : 'text-gray-500'
                    }`}
                    onClick={() => setTab('detail')}
                >
                    상세 정보
                </li>
            </ul>

            {/* ---------------------- */}
            {/* 상세 정보 */}
            {/* ---------------------- */}
            {tab === 'detail' && (
                <div className="p-4">
                    {/* 가게 정보 */}
                    <h2 className="font-bold text-lg mb-3">가게 정보</h2>

                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                        <img
                            src="https://placekitten.com/200/200"
                            alt="img"
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                            <p className="font-bold text-gray-900">{jsonData.marketName}</p>
                            <p className="text-gray-600">{jsonData.marketLocation}</p>
                        </div>
                    </div>

                    {/* 미션 현황 */}
                    <h2 className="font-bold text-lg mt-8">미션 현황</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        {jsonData.flagType === 'gold'
                            ? '축하합니다! 황금 깃발이 활성화되었습니다.'
                            : '조건 유지 실패 시 회색 깃발로 변경됩니다.'}
                    </p>

                    {/* 미션 1 */}
                    <div className="mt-4 bg-white p-4 rounded-xl shadow-sm flex gap-3">
                        <div className="w-10 h-10 bg-green-300 rounded-md" />
                        <div>
                            <p className="text-gray-800">5만원 이상 캐시 결제</p>
                            <p className="font-bold">
                                {jsonData.marketMission1 ? '미션 완료' : '미션 진행 중'}
                            </p>
                        </div>
                    </div>

                    {/* 미션 2 */}
                    <div className="mt-4 bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-gray-800">신규회원 3명 가입 및 코드 작성</p>
                        <p className="font-bold mt-1">
                            {jsonData.marketMission2 ? '미션 완료' : '미션 진행 중'}
                        </p>

                        <ul className="flex gap-2 mt-2">
                            {[1, 2, 3].map((i) => (
                                <li
                                    key={i}
                                    className={`w-3 h-3 rounded-full ${
                                        i <= jsonData.marketMission2List.length
                                            ? 'bg-blue-500'
                                            : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </ul>

                        <ul className="mt-3 space-y-2">
                            {jsonData.marketMission2List.map((m, idx) => (
                                <li key={idx} className="flex justify-between text-sm">
                                    <span>
                                        {m.nickname} · {m.name}
                                    </span>
                                    <span>{m.tel}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* ---------------------- */}
            {/* Drawer */}
            {/* ---------------------- */}
            <Drawer
                isExpanded={drawer.isOpen}
                onClose={() => setDrawer({ isOpen: false, type: '' })}
                title={drawer.type === 'filter' ? '조회 필터' : ''}
            >
                {drawer.type === 'filter' && (
                    <div className="space-y-4">
                        <p className="font-bold text-gray-800">필터 기능 (더미)</p>
                        <button
                            className="w-full bg-blue-500 text-white p-3 rounded-xl"
                            onClick={() => setDrawer({ isOpen: false, type: '' })}
                        >
                            닫기
                        </button>
                    </div>
                )}
            </Drawer>
        </div>
    );
}
