import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { fetchBoardById, fetchBoards } from '@/fetchData/board';
import { apiTest2 } from '@/fetchData/fetch-get';
import { fetchInfiniteItemsFromApi2 } from '@/fetchData/fetch-infinite';
import { fetchPaginatedItems2 } from '@/fetchData/fetch-pagination';

/**
 * 프로젝트 전체의 React Query 키와 페칭 함수(queryFn)를 중앙에서 관리하는 팩토리 객체.
 * 각 도메인별로 계층 구조를 가집니다.
 */
export const queryKeys = createQueryKeyStore({
    // 게시판 도메인
    board: {
        /**
         * [게시판 전체 목록 조회]
         * @param cookie - SSR(서버 컴포넌트) 환경에서 수동으로 쿠키를 주입하기 위한 파라미터.
         * (CSR 환경에서는 브라우저가 자동으로 쿠키를 전송하므로 생략 가능)
         */
        all: (cookie?: string) => ({
            // [주의] 라이브러리 타입 에러 우회를 위해 `as any` 사용
            // 1. 동적 함수형 팩토리에서 빈 배열([])을 허용하지 않는 라이브러리의 엄격한 TS 규칙을 우회함.
            // 2. 런타임에서는 최종적으로 ["board", "all"] 이라는 깔끔한 쿼리 키가 생성됨.
            // 3. SSR과 CSR 환경에서 키가 달라져 Hydration이 깨지는 것을 막기 위해 cookie 파라미터를 키 배열에 포함하지 않음.
            queryKey: [] as any,
            queryFn: () => fetchBoards(cookie),
        }),
        /**
         * [게시판 단건 상세 조회]
         * @param id - 조회할 게시판/게시글의 고유 식별자
         * @param cookie - SSR용 쿠키 파라미터
         */
        detail: (id: string, cookie?: string) => ({
            // 파라미터로 받은 식별자(id)를 쿼리 키 배열에 포함함.
            // 런타임 최종 쿼리 키: ["board", "detail", id]
            queryKey: [id],
            queryFn: () => fetchBoardById(id, cookie),
        }),
    },

    // 유저 도메인
    user: {
        list: (cookie?: string) => ({
            queryKey: [] as any,
            queryFn: () => apiTest2(cookie),
        }),
    },

    // 홈 화면(Demo) 도메인 - 인피니티 스크롤, 페이지네이션 등
    home: {
        infinite: (cookie?: string) => ({
            queryKey: [] as any,
            // 💡 context 객체의 타입을 명시하여 pageParam을 number로 인식하게 함
            queryFn: ({ pageParam }: { pageParam: number }) =>
                fetchInfiniteItemsFromApi2({
                    pageParam,
                    cookieString: cookie,
                }),
        }),
        paginated: (page: number, cookie?: string) => ({
            queryKey: [page] as any,
            queryFn: () => fetchPaginatedItems2({ page, cookieString: cookie }),
        }),
    },
});
