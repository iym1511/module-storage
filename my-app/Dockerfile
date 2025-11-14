# 1. Node 베이스 이미지
FROM node:20-alpine

# 2. 작업 디렉토리
WORKDIR /app

# 3. package.json 복사 및 설치
COPY package*.json ./
RUN npm ci --only=production

# 4. 소스 복사
COPY . .

# 5. 환경 변수 (배포 시 Docker에서 주입)
ENV NODE_ENV=production
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_ANON_KEY}

# 6. 포트 오픈
EXPOSE 3000

# 7. 앱 시작
CMD ["npm", "run", "start"]
