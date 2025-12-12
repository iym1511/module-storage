'use client'
import React, {ReactNode, useEffect, useRef, useState} from 'react';


interface ScrollableListProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    deps?: any[]; // 스크롤 재등록이 필요한 의존성
    emptyMessage?: string;
    emptyIcon?: string;
}

// type LocalItem = {
//     idx: number | null;
//     cityNm: string | null;
//     localNm: string | null;
// };
//
// type LocalState = {
//     applied: LocalItem | null;
//     temp: LocalItem | null;
// };

// 드로어 높이 상수
const DRAWER_HEIGHTS = {
    initial: 160,
    mid: 420,
    expanded: typeof window !== "undefined" ? window.innerHeight - 70 : 500, // 500은 ssr에서의 에러방지 기본값
};
export default function ScrollDrawer({
                                           children,
                                           className = '',
                                           style = {},
                                           emptyMessage = '표시할 내역이 없습니다.',
                                           emptyIcon = '/images/icon_exclamation.png'
                                       }: ScrollableListProps) {
    const [flagStatus, setFlagStatus] = useState<"all" | "gold" | "grey">("all");

    const [drawerState, setDrawerState] = useState("initial");
    const [drawerHeight, setDrawerHeight] = useState(DRAWER_HEIGHTS.initial);
    const [isDragging, setIsDragging] = useState(false);

    const drawerRef = useRef<HTMLDivElement | null>(null);
    const pullerRef = useRef<HTMLDivElement | null>(null);
    const filterRef = useRef<HTMLDivElement | null>(null);

    const touchStart = useRef<number | null>(null);
    const startHeight = useRef<number>(DRAWER_HEIGHTS.initial);
    const listRef = useRef<HTMLDivElement | null>(null);
    const rafId = useRef<number | null>(null);

    // 스크롤 체이닝 방지 적용
    useEffect(() => {
        const element = listRef.current;
        if (!element) return;

        let startY = 0;

        // 터치 시작 시 Y 좌표 저장
        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
            e.stopPropagation(); // 부모 요소로 이벤트 전파 방지
        };

        // 터치 이동 시 오버스크롤 방지
        const handleTouchMove = (e: TouchEvent) => {
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - startY; // 양수: 아래로, 음수: 위로

            const isScrollable = element.scrollHeight > element.clientHeight;

            if (isScrollable) {
                // 스크롤 가능한 경우: 오버스크롤만 차단
                const isAtTop = element.scrollTop === 0;
                const isAtBottom =
                    element.scrollTop + element.clientHeight >= element.scrollHeight;

                // 최상단에서 아래로 당기기 or 최하단에서 위로 당기기
                if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
                    e.preventDefault(); // 외부 스크롤 차단
                    return;
                }
            } else {
                // 스크롤 불가능한 경우: 모든 수직 이동 차단
                e.preventDefault();
            }

            e.stopPropagation();
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
        };
    }, [listRef]);

    // children이 배열이고 비어있는지 체크
    const isEmpty = Array.isArray(children) && children.length === 0;

    // ---------------------------------------
    // 가장 가까운 스냅 포인트 찾기
    // ---------------------------------------
    const getClosestSnapPoint = (currentHeight: number) => {
        const distances = [
            { state: "initial", height: DRAWER_HEIGHTS.initial, distance: Math.abs(currentHeight - DRAWER_HEIGHTS.initial) },
            { state: "mid", height: DRAWER_HEIGHTS.mid, distance: Math.abs(currentHeight - DRAWER_HEIGHTS.mid) },
            { state: "expanded", height: DRAWER_HEIGHTS.expanded, distance: Math.abs(currentHeight - DRAWER_HEIGHTS.expanded) },
        ];
        distances.sort((a, b) => a.distance - b.distance);
        console.log(currentHeight, distances[0]);
        return distances[0];
    };

    // ---------------------------------------
    // 깃발 필터
    // ---------------------------------------
    // const handleStatusFilter = (status: any) => {
    //     setFlagStatus(status);
    //
    //     if (status === "all") {
    //         setMarketList(dummyMarketList);
    //     } else {
    //         setMarketList(dummyMarketList.filter((item) => item.flagType === status));
    //     }
    // };

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
    // cleanup: rafId 정리
    // ---------------------------------------
    useEffect(() => {
        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    return (
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
            {/*{["all", "gold", "grey"].map((type) => (*/}
            {/*    <button*/}
            {/*        key={type}*/}
            {/*        onClick={() => handleStatusFilter(type)}*/}
            {/*        className={`px-3 py-2 rounded-full border text-sm flex items-center gap-2 transition */}
            {/*    ${*/}
            {/*            flagStatus === type*/}
            {/*                ? "bg-black text-white"*/}
            {/*                : "bg-white text-gray-700 border-gray-300"*/}
            {/*        }`}*/}
            {/*    >*/}
            {/*        {type === "all" && "전체"}*/}
            {/*        {type === "gold" && "황금깃발"}*/}
            {/*        {type === "grey" && "회색깃발"}*/}

            {/*        {type !== "all" && (*/}
            {/*            <span className="text-sm">*/}
            {/*                        {dummyMarketList.filter((v) => v.flagType === type).length}*/}
            {/*                    </span>*/}
            {/*        )}*/}
            {/*    </button>*/}
            {/*))}*/}
        </div>

        <div
            ref={listRef}
            className={`overflow-auto ${className}`}
            style={{
                overscrollBehavior: 'contain',
                touchAction: 'pan-y',
                ...style
            }}
        >
            {isEmpty ? (
                <div className="flex flex-col items-center py-20 text-gray-500">
                    <img src={emptyIcon} width={48} alt="empty" />
                    {emptyMessage}
                </div>
            ) : (
                children
            )}
        </div>
    </div>
    );
}