'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { apiTest2, UserType } from '../../../../fetchData/fetch-get';
import { getCookie } from 'cookies-next';

interface UserListProps {
    initialData?: UserType[];
}

export default function UserList({ initialData }: UserListProps) {
    const token = getCookie('access_token');

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        // queryFn: apiTest,
        queryFn: () => apiTest2(token),
        initialData: initialData, // 초기 데이터 활용
        select: (data) =>
            data.map((user) => ({
                ...user,
                name: `${user.name} (가공됨)`,
            })),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-6 w-[150px]" />
                        <Skeleton className="h-4 w-[250px]" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {users?.map((item, index) => (
                <div key={index}>
                    <h3>{item.id}</h3>
                    <p>{item.name}</p>
                </div>
            ))}
        </div>
    );
}
