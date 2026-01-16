create table users (
    id serial primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    created_at timestamp default current_timestamp,
    password_hash varchar(255) not null
);

/* 회원가입 함수 */
create or replace function public.create_user(
    p_email text,
    p_password text,
    p_name text
)
    returns users as $$
declare
    new_user users;
begin
    insert into users (email, password_hash, name, created_at)
    values (p_email, p_password, p_name, now())

    -- 삽입된 데이터를 반환해줄 변수에 바로 저장
    returning * into new_user;

    return new_user;
end;
$$ language plpgsql security definer;

-- 	함수의 언어를 지정합니다. 이 경우 plpgsql입니다.

/* 이메일 중복 체크 */
create or replace function public.check_email(
    p_email text
)
    returns json as $$
declare
    exists_flag boolean;
begin
    select exists(
        select 1 from public.users where email = p_email
    ) into exists_flag;

-- supabase는 json 형태로 반환해줘야 하므로 json_build_object를 사용
    return json_build_object('exists', exists_flag);
end;
$$ language plpgsql security definer;


/* 로그인 (이메일로 사용자 조회) */
create or replace function public.get_user_by_email(
    p_email text
)
    returns users as $$
begin
    return (
        select *
        from public.users
        where email = p_email
        limit 1
    );
end;
$$ language plpgsql security definer;

/* 토큰 재발급 */
create or replace function public.get_user_by_email(
    p_email text
)
    returns users as $$
declare
    result users%rowtype;
begin
    select *
    into result
    from public.users
    where email = p_email
    limit 1;

    return result;
end;
$$ language plpgsql security definer;

/* 리프래시 토큰 발급 */
create table refresh_tokens (
    id bigint generated always as identity primary key,
    user_id uuid references users(id) on delete cascade,
    token text not null,
    expires_at timestamptz not null,
    created_at timestamptz default now()
);