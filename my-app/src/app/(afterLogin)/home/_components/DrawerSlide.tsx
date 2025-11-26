import React, {useEffect, useRef, useState} from "react";
import Drawer from "@/components/Drawer";


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
    expanded: window.innerHeight - 70,
};

export default function DrawerSlide() {
    const [marketList, setMarketList] = useState(dummyMarketList);
    const [flagStatus, setFlagStatus] = useState<"all" | "gold" | "grey">("all");

    const [drawerState, setDrawerState] = useState("initial");
    const [drawerHeight, setDrawerHeight] = useState(DRAWER_HEIGHTS.initial);
    const [isDragging, setIsDragging] = useState(false);

    const drawerRef = useRef<HTMLDivElement | null>(null);
    const pullerRef = useRef<HTMLDivElement | null>(null);
    const filterRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const [commonDrawer, setCommonDrawer] = useState({ isOpen: false, type: "" });

    const [localState, setLocalState] = useState<LocalState>({
        applied: null,
        temp: null,
    });

    const touchStart = useRef<number | null>(null);
    const startHeight = useRef<number>(DRAWER_HEIGHTS.initial);
    const rafId = useRef<number | null>(null);

    // ---------------------------------------
    // 깃발 필터
    // ---------------------------------------
    const handleStatusFilter = (status: any) => {
        setFlagStatus(status);

        if (status === "all") {
            setMarketList(dummyMarketList);
        } else {
            setMarketList(dummyMarketList.filter((item) => item.flagType === status));
        }
    };

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
    // 가장 가까운 스냅 포인트 찾기
    // ---------------------------------------
    const getClosestSnapPoint = (currentHeight: number) => {
        const distances = [
            { state: "initial", height: DRAWER_HEIGHTS.initial, distance: Math.abs(currentHeight - DRAWER_HEIGHTS.initial) },
            { state: "mid", height: DRAWER_HEIGHTS.mid, distance: Math.abs(currentHeight - DRAWER_HEIGHTS.mid) },
            { state: "expanded", height: DRAWER_HEIGHTS.expanded, distance: Math.abs(currentHeight - DRAWER_HEIGHTS.expanded) },
        ];
        console.log(distances);
        distances.sort((a, b) => a.distance - b.distance);
        return distances[0];
    };

// ---------------------------------------
// [수정된 로직] 콘텐츠 영역 스크롤 제어 및 체이닝 방지
// ---------------------------------------
    useEffect(() => {
        const content: any = contentRef.current;
        if (!content) return;

        let startY = 0; // 터치 시작 Y 좌표를 로컬 변수로 관리

        // 터치 시작 시 Y 좌표 저장 (Passive: true로 스크롤 허용)
        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
            e.stopPropagation(); // 드로어 드래그 로직으로 전파되는 것을 방지
        };

        // 터치 이동 시 스크롤 가능 여부 및 오버 스크롤 확인 (Passive: false로 preventDefault 사용)
        const handleTouchMove = (e: TouchEvent) => {
            const currentY = e.touches[0].clientY;
            // deltaY: 양수(아래로 드래그), 음수(위로 드래그)
            const deltaY = currentY - startY;

            const isScrollable = content.scrollHeight > content.clientHeight;

            if (isScrollable) {
                // 리스트 스크롤이 필요할 때: 오버 스크롤만 차단합니다.
                const isAtTop = content.scrollTop === 0;
                // content.scrollHeight는 총 높이, content.clientHeight는 보이는 높이
                const isAtBottom = content.scrollTop + content.clientHeight >= content.scrollHeight;

                // 1. 최상단에서 아래로 당길 때 (더 이상 스크롤할 곳이 없음)
                // 2. 최하단에서 위로 당길 때 (더 이상 스크롤할 곳이 없음)
                if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
                    e.preventDefault(); // 외부(지도/body) 스크롤 차단
                    return;
                }

            } else {
                // 리스트 스크롤이 불가능할 때 (목록이 짧을 때):
                // 모든 수직 터치 이동을 차단하여 외부(지도/body) 스크롤을 막습니다.
                e.preventDefault();
            }

            // 이벤트가 상위 요소로 전파되는 것을 막음 (필터/풀러 드래그와 간섭 방지)
            e.stopPropagation();
        };

        content.addEventListener("touchstart", handleTouchStart, { passive: true });
        content.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            content.removeEventListener("touchstart", handleTouchStart);
            content.removeEventListener("touchmove", handleTouchMove);
        };
    }, [marketList]); // marketList가 바뀔 때 스크롤 가능 여부가 달라지므로 의존성 배열에 포함

    
    // ---------------------------------------
    // cleanup: rafId 정리
    // ---------------------------------------
    useEffect(() => {
        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    // ---------------------------------------
    // 드로어 전체 영역 이벤트 차단
    // ---------------------------------------
    // useEffect(() => {
    //     const drawer: any = drawerRef.current;
    //     if (!drawer) return;
    //
    //     const handleDrawerTouch = (e: TouchEvent) => {
    //         e.stopPropagation();
    //     };
    //
    //     drawer.addEventListener("touchstart", handleDrawerTouch, { passive: true });
    //     drawer.addEventListener("touchmove", handleDrawerTouch, { passive: true });
    //     drawer.addEventListener("touchend", handleDrawerTouch, { passive: true });
    //
    //     return () => {
    //         drawer.removeEventListener("touchstart", handleDrawerTouch);
    //         drawer.removeEventListener("touchmove", handleDrawerTouch);
    //         drawer.removeEventListener("touchend", handleDrawerTouch);
    //     };
    // }, []);

    // ---------------------------------------
    // Drawer 실시간 드래그
    // ---------------------------------------
    useEffect(() => {
        const drawer: any = drawerRef.current;
        const puller: any = pullerRef.current;
        const filter: any = filterRef.current;

        if (!drawer || !puller || !filter) return;

        const handleStart = (e: TouchEvent) => {
            e.stopPropagation();
            touchStart.current = e.touches[0].clientY;
            startHeight.current = drawerHeight;
            setIsDragging(true);
        };

        const handleMove = (e: TouchEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (touchStart.current === null) return;

            const currentY = e.touches[0].clientY;
            const diff = touchStart.current - currentY;
            const newHeight = startHeight.current + diff;
            console.log("currentY : ", currentY);
            console.log("diff : ", diff);
            console.log("newHeight : ", newHeight);

            // 최소/최대 높이 제한
            const clampedHeight = Math.max(
                DRAWER_HEIGHTS.initial,
                Math.min(DRAWER_HEIGHTS.expanded, newHeight)
            );

            // requestAnimationFrame으로 부드러운 업데이트
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }

            rafId.current = requestAnimationFrame(() => {
                setDrawerHeight(clampedHeight);
            });
        };

        const handleEnd = (e: TouchEvent) => {
            e.stopPropagation();
            setIsDragging(false);

            if (touchStart.current === null) return;

            // 남아있는 requestAnimationFrame 취소
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }

            // 가장 가까운 스냅 포인트로 이동
            const snapPoint = getClosestSnapPoint(drawerHeight);
            setDrawerHeight(snapPoint.height);
            setDrawerState(snapPoint.state);

            touchStart.current = null;
        };

        // initial: drawer 전체 터치
        if (drawerState === "initial") {
            drawer.addEventListener("touchstart", handleStart, { passive: false });
            drawer.addEventListener("touchmove", handleMove, { passive: false });
            drawer.addEventListener("touchend", handleEnd, { passive: false });
            return () => {
                drawer.removeEventListener("touchstart", handleStart);
                drawer.removeEventListener("touchmove", handleMove);
                drawer.removeEventListener("touchend", handleEnd);
            };
        }

        // mid/expanded: puller & filter 영역만 터치
        puller.addEventListener("touchstart", handleStart, { passive: false });
        puller.addEventListener("touchmove", handleMove, { passive: false });
        puller.addEventListener("touchend", handleEnd, { passive: false });

        filter.addEventListener("touchstart", handleStart, { passive: false });
        filter.addEventListener("touchmove", handleMove, { passive: false });
        filter.addEventListener("touchend", handleEnd, { passive: false });

        return () => {
            puller.removeEventListener("touchstart", handleStart);
            puller.removeEventListener("touchmove", handleMove);
            puller.removeEventListener("touchend", handleEnd);

            filter.removeEventListener("touchstart", handleStart);
            filter.removeEventListener("touchmove", handleMove);
            filter.removeEventListener("touchend", handleEnd);
        };
    }, [drawerState, drawerHeight]);

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

            {/* ----------------------------- */}
            {/* 드로어 영역 */}
            {/* ----------------------------- */}
            <div
                ref={drawerRef}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg overflow-hidden z-50"
                style={{
                    height: `${drawerHeight}px`,
                    transition: isDragging ? 'none' : 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {/* Puller */}
                <div ref={pullerRef} className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                {/* 상태 필터 */}
                <div
                    ref={filterRef}
                    className="flex gap-2 px-4 pb-3"
                >
                    {["all", "gold", "grey"].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleStatusFilter(type)}
                            className={`px-3 py-2 rounded-full border text-sm flex items-center gap-2 transition 
                ${
                                flagStatus === type
                                    ? "bg-black text-white"
                                    : "bg-white text-gray-700 border-gray-300"
                            }`}
                        >
                            {type === "all" && "전체"}
                            {type === "gold" && "황금깃발"}
                            {type === "grey" && "회색깃발"}

                            {type !== "all" && (
                                <span className="text-sm">
                                    {dummyMarketList.filter((v) => v.flagType === type).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* 리스트 */}
                <div
                    ref={contentRef}
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
                </div>
            </div>

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