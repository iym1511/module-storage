import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import BoardDetail from '@/components/board/BoardDetail';
import { queryKeys } from '@/lib/query-keys';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BoardDetailPage({ params }: PageProps) {
    const { id } = await params;
    const queryClient = new QueryClient();
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    // SSR에서 데이터 미리 가져오기
    await queryClient.prefetchQuery(queryKeys.board.detail(id, cookieString));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="mx-auto py-10">
                <BoardDetail id={id} />
            </div>
        </HydrationBoundary>
    );
}
