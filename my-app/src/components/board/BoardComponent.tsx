'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createBoard, deleteBoard, fetchBoards, updateBoard } from '@/fetchData/board';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Board } from '@/types/board'; // 스키마 정의

// 스키마 정의
const boardSchema = z.object({
    title: z.string().min(1, '제목을 입력해주세요'),
    content: z.string().min(1, '내용을 입력해주세요'),
});

type BoardFormData = z.infer<typeof boardSchema>;

export default function BoardComponent() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);

    // 1. 데이터 조회 (Read)
    const {
        data: boards,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['boards'],
        queryFn: () => fetchBoards(),
    });

    // 2. 데이터 생성 (Create)
    const createMutation = useMutation({
        mutationFn: createBoard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            setIsModalOpen(false);
            reset();
        },
        onError: (err) => {
            alert('게시글 작성 실패: ' + err);
        },
    });

    // 3. 데이터 수정 (Update)
    const updateMutation = useMutation({
        mutationFn: (data: { id: string; payload: BoardFormData }) =>
            updateBoard(data.id, data.payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            setIsModalOpen(false);
            setEditingBoard(null);
            reset();
        },
        onError: (err) => {
            alert('게시글 수정 실패: ' + err);
        },
    });

    // 4. 데이터 삭제 (Delete)
    const deleteMutation = useMutation({
        mutationFn: deleteBoard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
        onError: (err) => {
            alert('게시글 삭제 실패: ' + err);
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<BoardFormData>({
        resolver: zodResolver(boardSchema),
    });

    const onSubmit = (data: BoardFormData) => {
        if (editingBoard) {
            updateMutation.mutate({ id: editingBoard.id, payload: data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (board: Board) => {
        setEditingBoard(board);
        setValue('title', board.title);
        setValue('content', board.content);
        setIsModalOpen(true);
    };

    const handleOpenChange = (open: boolean) => {
        setIsModalOpen(open);
        if (!open) {
            setEditingBoard(null);
            reset();
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading boards</div>;

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">게시판 (CRUD)</h2>
                <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button>글쓰기</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingBoard ? '게시글 수정' : '새 게시글 작성'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Input placeholder="제목" {...register('title')} />
                                {errors.title && (
                                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                                )}
                            </div>
                            <div>
                                <textarea
                                    className={cn(
                                        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                    )}
                                    placeholder="내용"
                                    {...register('content')}
                                    rows={5}
                                />
                                {errors.content && (
                                    <p className="text-red-500 text-sm">{errors.content.message}</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => handleOpenChange(false)}
                                >
                                    취소
                                </Button>
                                <Button type="submit">{editingBoard ? '수정' : '등록'}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {boards?.map((board) => (
                    <div
                        key={board.id}
                        className="border p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg">{board.title}</h3>
                                <p className="text-gray-500 text-sm mb-2">
                                    작성자: {board.author_name || board.author_email} |
                                    {new Date(board.created_at).toLocaleDateString()}
                                </p>
                                <p className="whitespace-pre-wrap">{board.content}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(board)}
                                >
                                    수정
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteMutation.mutate(board.id)}
                                >
                                    삭제
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                {boards?.length === 0 && (
                    <p className="text-center text-gray-500">게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
}
