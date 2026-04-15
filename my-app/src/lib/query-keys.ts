import { createQueryKeyStore } from '@lukemorales/query-key-factory';

/**
 * 프로젝트 전체의 React Query 키와 페칭 함수(queryFn)를 중앙에서 관리하는 팩토리 객체.
 * 각 도메인별로 계층 구조를 가집니다.
 */
export const queryKeys = createQueryKeyStore({
    // 게시판 도메인
    board: {
        /**
         * [게시판 전체 목록 조회]
         */
        all: null,
        /**
         * [게시판 단건 상세 조회]
         * @param id - 조회할 게시판/게시글의 고유 식별자
         * @param cookie - SSR용 쿠키 파라미터
         */
        detail: (id: string) => [id],
    },

    // 유저 도메인
    user: {
        list: null,
    },

    // 홈 화면(Demo) 도메인 - 인피니티 스크롤, 페이지네이션 등
    home: {
        infinite: null,
        paginated: (page: number) => [page],
    },
});
