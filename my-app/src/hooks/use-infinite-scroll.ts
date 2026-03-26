import { useEffect } from 'react';
import { IntersectionOptions, useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions extends IntersectionOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
}

/**
 * react-intersection-observer를 사용한 무한 스크롤 훅
 * @param fetchNextPage 다음 페이지를 가져오는 함수
 * @param options IntersectionObserver 옵션
 */
export function useInfiniteScroll({ fetchNextPage, ...options }: UseInfiniteScrollOptions) {
  /// inView : ref를 달아둔 요소가 화면에 보이고 있는지 확인
  const { ref, inView } = useInView({
    threshold: 0.1,
    ...options,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return { ref };
}
