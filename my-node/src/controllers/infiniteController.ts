import { Request, Response } from "express";

// 1. 가상의 DB (10개 데이터) - ID가 1부터 순차적으로 증가한다고 가정
const ORIGINAL_DB = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Backend Item ${i + 1}`,
  description: `This is item ${i + 1} from Node.js backend`,
}));

// 2. 커서 기반 인피니티 스크롤 컨트롤러
export const getInfiniteData = async (req: Request, res: Response) => {
  try {
    // 쿼리 파라미터 받기
    // cursor: 클라이언트가 가지고 있는 마지막 아이템의 ID (처음엔 0)
    const cursor = parseInt(req.query.cursor as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 5;

    // 커서 기반 데이터 필터링
    // DB 쿼리 예시: SELECT * FROM items WHERE id > cursor ORDER BY id ASC LIMIT limit
    const filteredData = ORIGINAL_DB.filter((item) => item.id > cursor);

    // limit만큼 자르기
    const data = filteredData.slice(0, limit);

    // 다음 커서 계산 (가져온 데이터의 마지막 아이템 ID)
    // 데이터가 limit보다 적게 남았으면 다음 페이지가 없는 것임
    const nextCursor =
      data.length === limit ? data[data.length - 1].id : undefined;

    return res.status(200).json({
      data,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 3. 페이지네이션 기반 컨트롤러 (Offset-based)
export const getPaginatedData = async (req: Request, res: Response) => {
  try {
    // 쿼리 파라미터 받기 (기본값: page 1, limit 5)
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const data = ORIGINAL_DB.slice(startIndex, endIndex);
    const totalCount = ORIGINAL_DB.length;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      data,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
