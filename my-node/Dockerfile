# 1. Node.js 설치
FROM node:18

# 2. 작업 폴더 만들기
WORKDIR /app

# 3. 패키지 정보 복사
COPY package*.json ./

# 4. 라이브러리 설치
RUN npm install

# 5. 소스 코드 전체 복사
COPY . .

# ⭐ [추가!] TypeScript -> JavaScript로 변환 (빌드)
RUN npm run build

# 6. 포트 열기
EXPOSE 8000

# 7. 실행 명령어
CMD ["npm", "start"]