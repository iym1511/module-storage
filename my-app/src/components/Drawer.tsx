'use client'
import React, {useEffect, useState} from "react";

interface DrawerProps {
    isExpanded: boolean;
    onClose: () => void;
    initialHeight?: string;
    expandedHeight?: string;
    children?: React.ReactNode;
    title?: string;
    isTitle?: boolean;
    topType?: "close" | "none";
}

export default function Drawer({
                                   isExpanded,
                                   onClose,
                                   initialHeight = "0px",
                                   expandedHeight = "90dvh",
                                   children,
                                   title = "필터",
                                   isTitle = true,
                                   topType = "close",
                               }: DrawerProps) {
    const [rendered, setRendered] = useState(isExpanded);

    useEffect(() => {
        if (isExpanded) {
            setRendered(true);
        } else {
            const timeout = setTimeout(() => setRendered(false), 400);
            return () => clearTimeout(timeout);
        }
    }, [isExpanded]);

    return (
        <>
            {/* 백드롭 */}
            {rendered && (
                <div
                    className="fixed inset-0 bg-black/40 z-[99990]"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`
          fixed bottom-0 left-0 right-0 w-full 
          bg-white rounded-t-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.06)]
          flex flex-col px-4 pt-4 transition-all duration-400 overflow-hidden z-[99999]
          ${isExpanded ? "h-[90dvh]" : "h-0"}
        `}
                style={{
                    height: isExpanded ? expandedHeight : initialHeight,
                }}
            >
                {/* 상단 닫기 버튼 */}
                {topType === "close" && (
                    <div className="w-full flex justify-end mb-3">
                        <button
                            onClick={onClose}
                            className="p-1 rounded-md hover:bg-gray-100 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M18 6L6 18M6 6L18 18"
                                    stroke="#111"
                                    strokeWidth="2"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* 타이틀 */}
                {isTitle && (
                    <h2 className="text-lg font-bold text-[#181D27] mb-4 tracking-tight">
                        {title}
                    </h2>
                )}

                {/* 콘텐츠 */}
                <div className="w-full h-full overflow-y-auto no-scrollbar pb-6">
                    {children ?? <DummyContent />} {/* 더미 데이터 */}
                </div>
            </div>
        </>
    );
}

/* ===========================
   📌 더미 데이터용 컴포넌트
   =========================== */
function DummyContent() {
    const dummy = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        label: `더미 옵션 ${i + 1}`,
    }));

    return (
        <div className="flex flex-col gap-3">
            {dummy.map((item) => (
                <div
                    key={item.id}
                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50
          flex justify-between items-center"
                >
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                </div>
            ))}
        </div>
    );
}
