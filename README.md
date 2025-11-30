# 🔬 Lab Homepage & Management System
> **연구실 소개 및 성과 관리를 위한 프로젝트**

React와 Spring Boot를 기반으로 구축되었으며, **Docker & Nginx**를 활용한 컨테이너 환경에서 운영됩니다.  
연구실 구성원과 논문/프로젝트 업적을 관리자 페이지에서 손쉽게 CRUD 할 수 있으며, **GitHub Actions**를 통해 AWS EC2로 자동 배포되는 CI/CD 파이프라인을 갖추고 있습니다.

<br/>

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Styled Components](https://img.shields.io/badge/Styled_Components-DB7093?style=flat-square&logo=styled-components&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) |
| **Backend** | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) |
| **Infra & DevOps** | ![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazon-aws&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white) |

<br/>

## 🏗 System Architecture

### 1. 배포 구조 (Deployment)
Nginx를 리버스 프록시(Reverse Proxy)로 사용하여 프론트엔드와 백엔드 컨테이너를 연결합니다.

```
graph LR
    User(Client) --> Nginx[Nginx (Port 80)]
    Nginx -->|/api/*| SB[Spring Boot Container]
    Nginx -->|/*| React[React Container]
    SB --> DB[(MySQL)]
```

**2. Nginx Configuration**
/api 경로는 백엔드로, 그 외 경로는 React SPA(Single Page Application)로 라우팅.
```
server {
    listen 80;
    server_name _;

    # Backend API Routing
    location /api/ {
        proxy_pass http://backend:8080/api/;
    }

    # Frontend Static Files & SPA Fallback
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
}
```

### ✨ Key Features
1️⃣ 관리자 페이지 (Admin)
- 인증 (Auth): localStorage를 활용한 로그인 유지 및 /admin/me 엔드포인트를 통한 세션 재검증

- 연구원 관리: 구성원 등록, 수정, 삭제 (CRUD)

- 업적 관리: 논문 및 프로젝트 성과 등록, 이미지 업로드 기능

- 이미지 처리: FormData를 활용한 Multipart 파일 전송 및 수정 시 기존 이미지 유지 로직(keepImages) 구현


2️⃣ 사용자 페이지 (Public)
- 연구실 소개: 랩실 비전 및 소개글 조회

- 구성원/업적 목록: DB에 등록된 최신 데이터를 실시간으로 조회 및 이미지 렌더링


3️⃣ 관리자 페이지 화면
<img width="1899" height="947" alt="image" src="https://github.com/user-attachments/assets/f22d91d0-5dfb-49cc-9fb0-0d62da218cc7" />



### 🚀 CI/CD Pipeline
GitHub Actions를 사용하여 코드가 푸시되면 EC2 서버에 자동으로 배포됩니다.

Push: Main 브랜치에 코드 업데이트

Connect: appleboy/ssh-action을 통해 AWS EC2 접속

Update: 최신 코드 Pull

Re-build: 기존 Docker 컨테이너 중지/삭제 후 이미지 재빌드 (docker build)

Run: 새로운 컨테이너 실행 (docker run)


### 🔥 Troubleshooting (문제 해결)
1. 이미지 업로드 415 Unsupported Media Type
- 문제: 이미지를 포함한 게시글 등록 시 백엔드에서 415 에러 반환

- 원인: Axios 요청 시 Content-Type 헤더 설정 미흡 및 JSON과 File 혼재

- 해결:
  - FormData 객체 생성 후 파일과 데이터를 append

  - Axios 헤더에 Content-Type: multipart/form-data 명시

  - 백엔드 MultipartResolver 설정 확인


2. API 요청 URL 문제 (Localhost Fallback)
- 문제: 배포 후에도 API 요청이 localhost:3001로 전송되어 통신 실패

- 원인: .env 환경변수가 빌드 시점에 제대로 주입되지 않아 Axios가 기본값으로 폴백(Fallback)됨

- 해결:
  - .env 파일에 REACT_APP_API_BASE="http://<EC2-IP>/api" 명시
  - CI/CD 파이프라인 상에서 환경변수 주입 단계 확인

 ### Installation & Run
```
# 1. Clone Repository
git clone [https://github.com/YOUR_REPO_URL.git](https://github.com/YOUR_REPO_URL.git)
```

```
# 2. Frontend Setup
cd frontend
npm install
npm start
```
