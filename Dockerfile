# React 빌드용 Node 컨테이너
FROM node:20-alpine AS build
WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm ci

##.env 파일 복사 빌드
COPY .env .env

# 소스 복사 후 빌드
COPY . .
RUN npm run build

# 빌드된 정적 파일을 Nginx로 서빙
FROM nginx:alpine

# nginx 설정으로 교체
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물을 Nginx 기본 경로로 복사
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
