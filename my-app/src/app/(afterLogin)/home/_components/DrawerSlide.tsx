'use client'
import React, {useState} from "react";
import Drawer from "@/components/Drawer";
import ScrollDrawer from "@/components/ScrollDrawer";


// -----------------------------
// 더미 데이터
// -----------------------------
const dummyMarketList = [
    {
        marketCode: "MK001",
        marketName: "삼겹살 맛집",
        marketLocation: "서울시 강남구",
        flagType: "gold",
        thumbImg: "https://placekitten.com/200/200"
    },
    {
        marketCode: "MK0024",
        marketName: "피자 천국",
        marketLocation: "서울시 마포구",
        flagType: "grey",
        thumbImg: "https://placekitten.com/201/201"
    },
    {
        marketCode: "MK0023",
        marketName: "피자 천국",
        marketLocation: "서울시 마포구",
        flagType: "grey",
        thumbImg: "https://placekitten.com/201/201"
    },

    {
        marketCode: "MK0022",
        marketName: "피자 천국",
        marketLocation: "서울시 마포구",
        flagType: "grey",
        thumbImg: "https://placekitten.com/201/201"
    },
    {
        marketCode: "MK0021",
        marketName: "피자 천국",
        marketLocation: "서울시 마포구",
        flagType: "grey",
        thumbImg: "https://placekitten.com/201/201"
    },



];

const dummyLocalList = [
    { idx: 1, cityNm: "서울", localNm: "강남구" },
    { idx: 2, cityNm: "서울", localNm: "마포구" },
    { idx: 3, cityNm: "부산", localNm: "해운대구" },
];

type LocalItem = {
    idx: number | null;
    cityNm: string | null;
    localNm: string | null;
};

type LocalState = {
    applied: LocalItem | null;
    temp: LocalItem | null;
};

// 드로어 높이 상수
const DRAWER_HEIGHTS = {
    initial: 160,
    mid: 420,
    expanded: typeof window !== "undefined" ? window.innerHeight - 70 : 500,
};

export default function DrawerSlide() {
    const [marketList, setMarketList] = useState(dummyMarketList);
    const [drawerState, setDrawerState] = useState("initial");
    const [drawerHeight, setDrawerHeight] = useState(DRAWER_HEIGHTS.initial);
    const [commonDrawer, setCommonDrawer] = useState({ isOpen: false, type: "" });

    const [localState, setLocalState] = useState<LocalState>({
        applied: null,
        temp: null,
    });

    // ---------------------------------------
    // 지역 필터
    // ---------------------------------------
    const handleLocalFilter = (item: any) => {
        setLocalState((prev) => ({
            ...prev,
            temp: localState.temp?.idx === item.idx ? null : item,
        }));
    };

    const handleLocalApply = () => {
        setLocalState({
            applied: localState.temp,
            temp: null,
        });

        setCommonDrawer({ isOpen: false, type: "" });
    };


    // ---------------------------------------
    // 렌더링
    // ---------------------------------------
    return (
        <div className="w-full h-screen bg-gray-100 relative overflow-hidden">

            {/* ----------------------------- */}
            {/* 지도 영역 (더미) */}
            {/* ----------------------------- */}
            <div className="w-full h-full bg-white border shadow-sm rounded-md flex items-center justify-center text-gray-400">
                지도 영역(더미)
            </div>

            {/* ----------------------------- */}
            {/* 상단 버튼 */}
            {/* ----------------------------- */}
            <div className="absolute top-0 w-full flex justify-between px-4 pt-16">
                <button className="opacity-0 px-3 py-2 bg-white shadow rounded-full text-sm flex items-center gap-2">
                    <span>현 지도에서 검색</span>
                </button>

                <button
                    onClick={() => setCommonDrawer({ isOpen: true, type: "local" })}
                    className="px-3 py-2 bg-white shadow rounded-full text-sm flex items-center gap-1"
                >
                    {localState.applied ? localState.applied.localNm : "지역 선택"}
                    <svg width="16" height="16">
                        <path d="M12 6L8 10L4 6" stroke="#333" />
                    </svg>
                </button>
            </div>

            {/* ----------------------------- */}
            {/* 목록 보기 버튼 */}
            {/* ----------------------------- */}
            <div className="absolute bottom-[220px] left-0 w-full flex justify-center z-50">
                <button
                    className="px-4 py-2 bg-white shadow rounded-full text-sm flex items-center gap-2"
                    onClick={() => {
                        setDrawerState("expanded");
                        setDrawerHeight(DRAWER_HEIGHTS.expanded);
                    }}
                >
                    <img src="/images/list.svg" width={16} />
                    목록보기
                </button>
            </div>


                {/* 리스트 */}
                <ScrollDrawer
                    className="px-4 overflow-auto h-full pb-10"
                    style={{
                        overscrollBehavior: 'contain',
                        // 스크롤이 필요하면 이 영역 내에서 스크롤을 처리하라는 의미
                        touchAction: 'pan-y'
                    }}
                >
                    {marketList.length > 0 ? (
                        marketList.map((item) => (
                            <div key={item.marketCode} className="flex gap-3 py-4 border-b">
                                <img
                                    src={item.thumbImg}
                                    className="w-16 h-16 rounded-md object-cover"
                                />

                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base font-semibold">{item.marketName}</h2>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                item.flagType === "gold" ? "bg-yellow-300" : "bg-gray-300"
                                            }`}
                                        >
                                            {item.flagType === "gold" ? "황금깃발" : "회색깃발"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">{item.marketLocation}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center py-20 text-gray-500">
                            <img src="/images/icon_exclamation.png" width={48} />
                            표시할 내역이 없습니다.
                        </div>
                    )}
                </ScrollDrawer>


            {/* ----------------------------- */}
            {/* Drawer: 지역 선택 */}
            {/* ----------------------------- */}
            <Drawer
                isExpanded={commonDrawer.isOpen}
                expandedHeight="300px"
                onClose={() => setCommonDrawer({ isOpen: false, type: "" })}
                title="지역 선택"
            >
                {commonDrawer.type === "local" && (
                    <div className="flex flex-col justify-between h-full">
                        <div className="overflow-auto px-2 space-y-5">
                            {[...new Set(dummyLocalList.map((v) => v.cityNm))].map((city) => (
                                <div key={city}>
                                    <h3 className="text-base font-bold mb-2">{city}</h3>
                                    <ul className="grid grid-cols-3 gap-2">
                                        {dummyLocalList
                                            .filter((v) => v.cityNm === city)
                                            .map((item) => (
                                                <li
                                                    key={item.idx}
                                                    onClick={() => handleLocalFilter(item)}
                                                    className={`py-3 rounded text-center text-sm font-medium cursor-pointer border
                                                        ${
                                                        localState.temp?.idx === item.idx
                                                            ? "bg-blue-100 border-blue-400 text-blue-600"
                                                            : "bg-white border-gray-300 text-gray-700"
                                                    }
                                                    `}
                                                >
                                                    {item.localNm}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <button
                            disabled={!localState.temp}
                            onClick={handleLocalApply}
                            className={`w-full py-3 rounded-lg text-white font-bold text-base mt-3
                                ${
                                localState.temp
                                    ? "bg-blue-600"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }
                            `}
                        >
                            확인
                        </button>
                    </div>
                )}
            </Drawer>
        </div>
    );
}