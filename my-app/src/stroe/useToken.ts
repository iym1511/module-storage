import {create} from "zustand/react";

interface StateType {
    accessToken: string;
}

interface SetStateType {
    setAccessToken: (token: string) => void;
}

// ✅ 두 타입 합치기ㅇ
type TokenStore = StateType & SetStateType;

export const useToken = create<TokenStore>((set, get) => ({
    accessToken: "",
    setAccessToken: (token) => set({ accessToken: token }),
}));