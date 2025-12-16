import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children, size = 'md', closeOnOverlay = true }) {
    const modalRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // 뒤 배경 스크롤되지 않도록
        }

        return () => {
            document.removeEventListener('keydown', handleEscape); // 이벤트 제거
            document.body.style.overflow = 'unset'; // 스크롤 복원
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    /* 모달 외부영역 클릭 시 닫기 */
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlay) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fade-in"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                tabIndex={-1} // 코드로만 focus
                className={`bg-card-bg rounded-lg shadow-xl w-full ${sizeClasses[size]} animate-slide-up`}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 id="modal-title" className="text-xl font-semibold text-fg">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-fg hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* 바디 */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

export default Modal;
