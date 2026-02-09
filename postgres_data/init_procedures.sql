-- 기존 함수 삭제 (파라미터 타입 변경 시 오버로딩 방지 및 타입 충돌 해결을 위해)
DROP FUNCTION IF EXISTS public.sp_get_boards();
DROP FUNCTION IF EXISTS public.sp_get_board_by_id(INT);
DROP FUNCTION IF EXISTS public.sp_get_board_by_id(UUID);
DROP FUNCTION IF EXISTS public.sp_create_board(VARCHAR, TEXT, VARCHAR);
DROP FUNCTION IF EXISTS public.sp_update_board(INT, VARCHAR, TEXT, VARCHAR);
DROP FUNCTION IF EXISTS public.sp_update_board(UUID, VARCHAR, TEXT, VARCHAR);
DROP FUNCTION IF EXISTS public.sp_delete_board(INT, VARCHAR);
DROP FUNCTION IF EXISTS public.sp_delete_board(UUID, VARCHAR);

-- 게시글 목록 조회
CREATE OR REPLACE FUNCTION public.sp_get_boards()
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    content TEXT,
    created_at TIMESTAMPTZ,
    author_id UUID,
    author_email VARCHAR,
    author_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id, 
        b.title, 
        b.content, 
        b.created_at, 
        b.author_id, 
        u.email::VARCHAR as author_email, 
        u.name::VARCHAR as author_name
    FROM public.boards b
    LEFT JOIN auth.users u ON b.author_id = u.id
    ORDER BY b.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 게시글 상세 조회
CREATE OR REPLACE FUNCTION public.sp_get_board_by_id(p_board_id UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    content TEXT,
    created_at TIMESTAMPTZ,
    author_id UUID,
    author_email VARCHAR,
    author_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id, 
        b.title, 
        b.content, 
        b.created_at, 
        b.author_id, 
        u.email::VARCHAR as author_email, 
        u.name::VARCHAR as author_name
    FROM public.boards b
    LEFT JOIN auth.users u ON b.author_id = u.id
    WHERE b.id = p_board_id;
END;
$$ LANGUAGE plpgsql;

-- 게시글 작성
CREATE OR REPLACE FUNCTION public.sp_create_board(
    p_title VARCHAR,
    p_content TEXT,
    p_user_email VARCHAR
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    content TEXT,
    created_at TIMESTAMPTZ,
    author_id UUID
) AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- 이메일로 사용자 ID 찾기
    SELECT u.id INTO v_user_id FROM auth.users u WHERE u.email = p_user_email;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    RETURN QUERY
    INSERT INTO public.boards (title, content, author_id)
    VALUES (p_title, p_content, v_user_id)
    RETURNING 
        public.boards.id, 
        public.boards.title, 
        public.boards.content, 
        public.boards.created_at, 
        public.boards.author_id;
END;
$$ LANGUAGE plpgsql;

-- 게시글 수정 (작성자 검증 포함)
CREATE OR REPLACE FUNCTION public.sp_update_board(
    p_board_id UUID,
    p_title VARCHAR,
    p_content TEXT,
    p_user_email VARCHAR
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    content TEXT,
    updated_at TIMESTAMPTZ
) AS $$
DECLARE
    v_author_id UUID;
BEGIN
    -- 게시글 작성자 확인
    SELECT b.author_id INTO v_author_id
    FROM public.boards b
    WHERE b.id = p_board_id;

    IF v_author_id IS NULL THEN
         RAISE EXCEPTION 'Board not found';
    END IF;

    -- 요청한 사용자가 작성자인지 확인
    IF v_author_id != (SELECT u.id FROM auth.users u WHERE u.email = p_user_email) THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    RETURN QUERY
    UPDATE public.boards
    SET 
        title = p_title, 
        content = p_content, 
        updated_at = CURRENT_TIMESTAMP
    WHERE public.boards.id = p_board_id
    RETURNING 
        public.boards.id, 
        public.boards.title, 
        public.boards.content, 
        public.boards.updated_at;
END;
$$ LANGUAGE plpgsql;

-- 게시글 삭제 (작성자 검증 포함)
CREATE OR REPLACE FUNCTION public.sp_delete_board(
    p_board_id UUID,
    p_user_email VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    v_author_id UUID;
BEGIN
    -- 게시글 작성자 확인
    SELECT b.author_id INTO v_author_id
    FROM public.boards b
    WHERE b.id = p_board_id;

    IF v_author_id IS NULL THEN
         RETURN FALSE; -- 게시글 없음
    END IF;

    -- 권한 확인
    IF v_author_id != (SELECT u.id FROM auth.users u WHERE u.email = p_user_email) THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    DELETE FROM public.boards WHERE id = p_board_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;