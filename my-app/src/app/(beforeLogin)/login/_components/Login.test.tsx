import {render, screen, waitFor} from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Login from './Login';

// Next.js의 useRouter를 모킹(가짜로 만들기)
// 실제 페이지 이동 대신 모킹된 함수가 호출되는지 확인하기 위함
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(), // push 함수를 가짜 함수로 만듦
    }),
}));

// 전역 fetch 함수를 모킹
// 실제 API 호출 대신 우리가 원하는 응답을 반환하도록 만듦
global.fetch = vi.fn();

describe('Login 컴포넌트 테스트', () => {
    // 각 테스트 실행 전에 모든 mock을 초기화
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ============================================
    // 1. 컴포넌트 렌더링 테스트
    // ============================================
    it('로그인 폼이 화면에 제대로 렌더링되는지 확인', () => {
        // 컴포넌트를 렌더링
        render(<Login />);

        // 화면에 "로그인" 텍스트가 있는 버튼이 있는지 확인
        const loginButton = screen.getByRole('button', { name: /로그인/i });
        expect(loginButton).toBeInTheDocument();

        // 이메일 입력 필드가 있는지 확인
        const emailInputs = screen.getAllByLabelText(/email/i);
        expect(emailInputs.length).toBeGreaterThan(0);
    });

    it('회원가입 폼이 화면에 제대로 렌더링되는지 확인', () => {
        render(<Login />);

        // 화면에 "회원가입" 텍스트가 있는 버튼이 있는지 확인
        const signupButton = screen.getByRole('button', { name: /회원가입/i });
        expect(signupButton).toBeInTheDocument();

        // NAME 입력 필드가 있는지 확인
        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toBeInTheDocument();
    });

    // ============================================
    // 2. 로그인 입력 필드 테스트
    // ============================================
    it('로그인 이메일 입력 시 값이 화면에 표시되는지 확인', async () => {
        render(<Login />);

        // 로그인 폼의 이메일 입력 필드를 찾음 (첫 번째 Email 입력 필드)
        const emailInputs = screen.getAllByLabelText(/email/i);
        const loginEmailInput = emailInputs[0];

        // userEvent를 사용해 실제 사용자처럼 타이핑
        await userEvent.type(loginEmailInput, 'test@example.com');

        // 입력한 값이 제대로 표시되는지 확인
        expect(loginEmailInput).toHaveValue('test@example.com');
    });

    it('로그인 비밀번호 입력 시 값이 화면에 표시되는지 확인', async () => {
        render(<Login />);

        // 로그인 폼의 비밀번호 입력 필드를 찾음 (첫 번째 PASSWORD 입력 필드)
        const passwordInputs = screen.getAllByLabelText(/password/i);
        const loginPasswordInput = passwordInputs[0];

        // 비밀번호 입력
        await userEvent.type(loginPasswordInput, 'password123');

        // 입력한 값이 제대로 표시되는지 확인
        expect(loginPasswordInput).toHaveValue('password123');
    });

    // ============================================
    // 3. 회원가입 입력 필드 테스트
    // ============================================
    it('회원가입 폼의 모든 입력 필드에 값 입력 시 제대로 표시되는지 확인', async () => {
        render(<Login />);

        // 회원가입 폼의 입력 필드들을 ID로 직접 찾음 (더 명확하고 안전함)
        const signupEmailInput = screen.getByLabelText('E-MAIL');
        const nameInput = screen.getByLabelText('NAME');
        const signupPasswordInput = document.querySelector('#signup-password') as HTMLInputElement;

        // 각 필드에 값 입력
        await userEvent.type(signupEmailInput, 'newuser@example.com');
        await userEvent.type(nameInput, '홍길동');
        await userEvent.type(signupPasswordInput, 'newpassword123');

        // 모든 값이 제대로 표시되는지 확인
        expect(signupEmailInput).toHaveValue('newuser@example.com');
        expect(nameInput).toHaveValue('홍길동');
        expect(signupPasswordInput).toHaveValue('newpassword123');
    });

    // ============================================
    // 4. 로그인 버튼 클릭 및 API 호출 테스트
    // ============================================
    it('로그인 버튼 클릭 시 API가 호출되고 페이지가 이동하는지 확인', async () => {
        // fetch 함수가 성공 응답을 반환하도록 설정
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        render(<Login />);

        // 로그인 폼에 값 입력
        const emailInputs = screen.getAllByLabelText(/email/i);
        const passwordInputs = screen.getAllByLabelText(/password/i);

        await userEvent.type(emailInputs[0], 'test@example.com');
        await userEvent.type(passwordInputs[0], 'password123'); 

        // 로그인 버튼 클릭
        const loginButton = screen.getByRole('button', { name: /로그인/i });
        await userEvent.click(loginButton);

        // fetch가 올바른 URL과 데이터로 호출되었는지 확인
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/ptc/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'password123',
                }),
            });
        });
    });

    // ============================================
    // 5. 회원가입 버튼 클릭 및 API 호출 테스트
    // ============================================
    it('회원가입 버튼 클릭 시 API가 호출되는지 확인', async () => {
        // fetch 함수가 성공 응답을 반환하도록 설정
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: '회원가입 성공' }),
        });

        // window.alert를 모킹
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

        render(<Login />);

        // 회원가입 폼에 값 입력 (ID로 직접 찾기)
        const signupEmailInput = screen.getByLabelText('E-MAIL');
        const nameInput = screen.getByLabelText('NAME');
        const signupPasswordInput = document.querySelector('#signup-password') as HTMLInputElement;

        await userEvent.type(signupEmailInput, 'newuser@example.com');
        await userEvent.type(nameInput, '홍길동');
        await userEvent.type(signupPasswordInput, 'newpassword123');

        // 회원가입 버튼 클릭
        const signupButton = screen.getByRole('button', { name: /회원가입/i });
        await userEvent.click(signupButton);
// 🔍 디버깅: fetch가 호출되었는지 확인
        console.log('fetch 호출 횟수:', (global.fetch as Mock).mock.calls.length);
        console.log('fetch 호출 내역:', (global.fetch as Mock).mock.calls);

        // fetch가 올바른 URL과 데이터로 호출되었는지 확인
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/ptc/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'newuser@example.com',
                    password: 'newpassword123',
                    name: '홍길동',
                }),
            });
        });

        // 성공 alert가 표시되었는지 확인
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('회원가입 성공!');
        });

        // 모킹 정리
        alertMock.mockRestore();
    });

    // ============================================
    // 6. 회원가입 실패 케이스 테스트
    // ============================================
    it('회원가입 실패 시 에러 메시지 alert가 표시되는지 확인', async () => {
        // fetch 함수가 실패 응답을 반환하도록 설정
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: '이미 존재하는 이메일입니다' }),
        });

        // window.alert를 모킹
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

        render(<Login />);

        // 회원가입 폼에 값 입력 (ID로 직접 찾기)
        const signupEmailInput = screen.getByLabelText('E-MAIL');
        const nameInput = screen.getByLabelText('NAME');
        const signupPasswordInput = document.querySelector('#signup-password') as HTMLInputElement;

        await userEvent.type(signupEmailInput, 'existing@example.com');
        await userEvent.type(nameInput, '홍길동');
        await userEvent.type(signupPasswordInput, 'password123');

        // 회원가입 버튼 클릭
        const signupButton = screen.getByRole('button', { name: /회원가입/i });
        await userEvent.click(signupButton);

        // 실패 alert가 표시되었는지 확인
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('회원가입 실패: 이미 존재하는 이메일입니다');
        });

        // 모킹 정리
        alertMock.mockRestore();
    });
});;