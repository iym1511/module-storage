import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import BoardComponent from '@/components/board/BoardComponent';
import { fetchBoards } from '@/fetchData/board';

export default async function BoardPage() {
    const queryClient = new QueryClient();
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    await queryClient.prefetchQuery({
        queryKey: ['boards'],
        queryFn: () => fetchBoards(cookieString),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="container mx-auto py-10">
                <BoardComponent />
            </div>
        </HydrationBoundary>
    );
}
