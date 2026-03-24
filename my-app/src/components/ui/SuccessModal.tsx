'use client';

import { type FC, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const SuccessModal: FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "성공적으로 처리되었습니다!", 
  description = "요청하신 작업이 완료되었습니다. 이제 다음 단계를 진행할 수 있습니다." 
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  // 무작위 컨페티 조각 생성
  const confettiPieces = [...Array(20)].map((_, i) => {
    const angle = (i / 20) * 360;
    const distance = 60 + Math.random() * 40;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;
    const rotation = Math.random() * 360;
    const scale = 0.5 + Math.random() * 0.5;
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
    const color = colors[i % colors.length];

    return { x, y, rotation, scale, color };
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300 focus:outline-none overflow-visible">
          <div className="flex flex-col items-center text-center">
            {/* Animation Canvas - 정돈된 크기 */}
            <div className="relative mb-6 h-20 w-24 flex items-center justify-center">
              {showContent && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {confettiPieces.map((p, i) => (
                      <div 
                        key={i}
                        className="confetti-piece"
                        style={{
                          backgroundColor: p.color,
                          '--tw-translate-x': `${p.x}px`,
                          '--tw-translate-y': `${p.y}px`,
                          '--tw-scale-x': p.scale,
                          '--tw-rotate': `${p.rotation}deg`,
                          animationDelay: `${Math.random() * 0.05}s`
                        } as React.CSSProperties}
                      />
                    ))}
                  </div>

                  <div className="animate-check-pop">
                    <svg width="72" height="72" viewBox="0 0 52 52" className="overflow-visible">
                      <circle 
                        className="animate-circle-draw stroke-emerald-500 fill-none" 
                        cx="26" cy="26" r="25" strokeWidth="3" 
                        strokeLinecap="round"
                      />
                      <path 
                        className="animate-check-draw stroke-emerald-500 fill-none" 
                        strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                        d="M14.1 27.2l7.1 7.2 16.7-16.8" 
                      />
                    </svg>
                  </div>
                </>
              )}
            </div>

            <Dialog.Title className="text-xl font-bold tracking-tight text-slate-900 mb-2">
              {title}
            </Dialog.Title>
            <Dialog.Description className="text-sm font-medium text-slate-500 leading-relaxed mb-8 px-2">
              {description}
            </Dialog.Description>

            <Button 
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-all"
            >
              확인
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
