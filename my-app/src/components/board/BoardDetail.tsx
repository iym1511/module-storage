'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { fetchBoardById } from '@/fetchData/board';

interface BoardDetailProps {
    id: string;
}

export default function BoardDetail({ id }: BoardDetailProps) {
    const router = useRouter();

    const {
        data: board,
        isLoading,
        error,
    } = useQuery({
        ...queryKeys.board.detail(id),
        queryFn: () => fetchBoardById(id),
    });

    if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
    if (error || !board)
        return <div className="p-10 text-center text-red-500">게시글을 불러오지 못했습니다.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">{board.title}</h2>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground border-b pb-4">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{board.author_name || board.author_email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(board.created_at).toLocaleString('ko-KR')}</span>
                </div>
            </div>

            <div className="whitespace-pre-wrap break-all min-h-[300px] py-6 text-lg leading-relaxed whitespace-pre-wrap">
                {board.content}
            </div>

            <div className="flex justify-end pt-6 border-t">
                <Button variant="outline" onClick={() => router.push('/board')}>
                    목록으로 돌아가기
                </Button>
            </div>
        </div>
    );
}
