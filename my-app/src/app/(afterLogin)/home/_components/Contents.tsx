'use client'
import React, {useState} from "react";
import Drawer from "@/components/Drawer";


export default function Contents() {
    // --------------------------
    // 1) 더미 데이터
    // --------------------------
    const [jsonData, setJsonData] = useState({
        flagType: "gold",
        marketName: "삼겹살 맛집",
        marketLocation: "서울시 강남구 어딘가",
        marketLat: "37.1231",
        marketLng: "127.1231",
        marketMission1: true,
        marketMission2: true,
        marketMission2List: [
            { nickname: "치킨", name: "홍길동", tel: "010-1111-2222" },
            { nickname: "피자", name: "이상혁", tel: "010-3333-4444" },
            { nickname: "햄버거", name: "박철수", tel: "010-5555-6666" },
        ],
        marketMission3: false,
        marketMission3Count: 2,
        marketStartDate: "2024-01-01",
        marketCheckDate: "2024-07-01",
    });

    const [detailPriceData, setDetailPriceData] = useState({
        monthPrice: 540000,
        totalPrice: 2530000,
        totalPage: 2,
        totalCount: 10,
        list: [
            { date: "2024-11-22", title: "캐시결제", time: "12:22", price: 15000, status: true },
            { date: "2024-11-22", title: "포인트결제", time: "13:11", price: 9000, status: false, total_price: 9000 },
            { date: "2024-11-21", title: "캐시결제", time: "15:20", price: 25000, status: true },
        ],
    });

    const [tab, setTab] = useState("detail");

    // --------------------------
    // Drawer 상태
    // --------------------------
    const [drawer, setDrawer] = useState({
        isOpen: false,
        type: "", // "filter" | "date"
    });

    // --------------------------
    // 게이지 퍼센티지 계산
    // ----------------------------
    const getProgressPercentage = () => {
        const now = new Date();
        const start = new Date(jsonData.marketStartDate);
        const end = new Date(jsonData.marketCheckDate);

        if (now < start) return 0;
        if (now > end) return 100;

        const total = Number(end) - Number(start);
        const current = Number(now) - Number(start);
        return Math.floor((current / total) * 100);
    };

    const progressPercentage = getProgressPercentage();

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
                        tab === "detail" ? "font-bold border-b-2 border-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => setTab("detail")}
                >
                    상세 정보
                </li>

                <li
                    className={`flex-1 text-center py-4 cursor-pointer ${
                        tab === "calculation" ? "font-bold border-b-2 border-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => setTab("calculation")}
                >
                    수익 내역
                </li>
            </ul>

            {/* ---------------------- */}
            {/* 상세 정보 */}
            {/* ---------------------- */}
            {tab === "detail" && (
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
                        {jsonData.flagType === "gold"
                            ? "축하합니다! 황금 깃발이 활성화되었습니다."
                            : "조건 유지 실패 시 회색 깃발로 변경됩니다."}
                    </p>

                    {/* 미션 1 */}
                    <div className="mt-4 bg-white p-4 rounded-xl shadow-sm flex gap-3">
                        <div className="w-10 h-10 bg-green-300 rounded-md" />
                        <div>
                            <p className="text-gray-800">5만원 이상 캐시 결제</p>
                            <p className="font-bold">
                                {jsonData.marketMission1 ? "미션 완료" : "미션 진행 중"}
                            </p>
                        </div>
                    </div>

                    {/* 미션 2 */}
                    <div className="mt-4 bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-gray-800">신규회원 3명 가입 및 코드 작성</p>
                        <p className="font-bold mt-1">
                            {jsonData.marketMission2 ? "미션 완료" : "미션 진행 중"}
                        </p>

                        <ul className="flex gap-2 mt-2">
                            {[1, 2, 3].map((i) => (
                                <li
                                    key={i}
                                    className={`w-3 h-3 rounded-full ${
                                        i <= jsonData.marketMission2List.length ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                                />
                            ))}
                        </ul>

                        <ul className="mt-3 space-y-2">
                            {jsonData.marketMission2List.map((m, idx) => (
                                <li key={idx} className="flex justify-between text-sm">
                                    <span>{m.nickname} · {m.name}</span>
                                    <span>{m.tel}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* ---------------------- */}
            {/* 수익 내역 */}
            {/* ---------------------- */}
            {tab === "calculation" && (
                <div className="p-4">
                    <div className="flex justify-between mb-4">
                        <div>
                            <p className="text-gray-500">월 누적 정산 금액</p>
                            <h1 className="text-xl font-bold">{detailPriceData.monthPrice.toLocaleString()}원</h1>
                        </div>

                        <button
                            className="px-4 py-2 bg-gray-100 rounded-md"
                            onClick={() => setDrawer({ isOpen: true, type: "filter" })}
                        >
                            필터
                        </button>
                    </div>

                    {/* 날짜별 수익 리스트 */}
                    {detailPriceData.list.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm mb-2">
                            <p className="text-sm text-gray-500 mb-1">{item.date}</p>
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-gray-500">{item.time}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${item.status ? "text-black" : "text-gray-400"}`}>
                                        +{item.price.toLocaleString()}원
                                    </p>
                                    {!item.status && (
                                        <p className="text-xs text-gray-500">
                                            정산 대기 {(item.total_price ?? item.price).toLocaleString()}원
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ---------------------- */}
            {/* Drawer */}
            {/* ---------------------- */}
            <Drawer
                isExpanded={drawer.isOpen}
                onClose={() => setDrawer({ isOpen: false, type: "" })}
                title={drawer.type === "filter" ? "조회 필터" : ""}
            >
                {drawer.type === "filter" && (
                    <div className="space-y-4">
                        <p className="font-bold text-gray-800">필터 기능 (더미)</p>
                        <button
                            className="w-full bg-blue-500 text-white p-3 rounded-xl"
                            onClick={() => setDrawer({ isOpen: false, type: "" })}
                        >
                            닫기
                        </button>
                    </div>
                )}
            </Drawer>
        </div>
    );
}
