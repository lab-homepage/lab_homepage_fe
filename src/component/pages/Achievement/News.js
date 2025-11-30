import React, { useEffect, useMemo, useState } from "react";
import NewsComponent from "./NewsComponent";
import "./News.css";
import Footer from "../../Footer.js";
import api from "../../../config/api.js";

function News() {
  const [newsList, setNewsList] = useState([]);
  const FILE_BASE = "http://13.210.0.69:8080";

  //pagination
  const PAGE_SIZE = 5; // 한 페이지에 5개
  const GROUP_SIZE = 10; // 1~10, 11~20 처럼 10개씩 그룹
  const [page, setPage] = useState(1);

  // 안전하게 문자열만 반환
  const toImg = (u) => {
    if (typeof u !== "string" || !u.trim()) return "/images/placeholder.jpg";
    const url = u.trim();
    if (/^https?:\/\//i.test(url)) return url; // 절대 URL
    const base = FILE_BASE.replace(/\/$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  };

  // 응답 객체에서 "첫 번째 이미지 경로 문자열" 추출 (배열/객체/혼용 키 모두 처리)
  const pickFirstImage = (item) => {
    const candidates = [];

    // 1) 가장 흔한 케이스: 문자열 배열
    if (Array.isArray(item?.imageUrl)) candidates.push(...item.imageUrl);
    if (Array.isArray(item?.imageurl)) candidates.push(...item.imageurl);
    if (Array.isArray(item?.images)) candidates.push(...item.images);

    // 2) 단일 문자열
    if (typeof item?.imageUrl === "string") candidates.push(item.imageUrl);
    if (typeof item?.imageurl === "string") candidates.push(item.imageurl);
    if (typeof item?.image === "string") candidates.push(item.image);
    if (typeof item?.cover === "string") candidates.push(item.cover);

    // 3) 객체 배열(예: [{url:"/path"}, {imageUrl:"..."}])
    const flattened = [];
    for (const c of candidates) {
      if (typeof c === "string") flattened.push(c);
      else if (c && typeof c === "object") {
        if (typeof c.url === "string") flattened.push(c.url);
        else if (typeof c.path === "string") flattened.push(c.path);
        else if (typeof c.imageUrl === "string") flattened.push(c.imageUrl);
      }
    }

    // 4) 최종 선택
    const first = flattened.find(
      (s) => typeof s === "string" && s.trim().length > 0
    );
    return first || undefined;
  };

  const pickYear = (item) => {
    const d = item?.publishedAt || item?.createdAt || item?.updatedAt || "";
    const dt = d ? new Date(d) : null;
    return dt && !isNaN(dt) ? String(dt.getFullYear()) : "";
    // 필요하면 월/일까지 보여주고 싶을 때 여기서 포맷 추가
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const { data } = await api.get("/api/achievements");
        setNewsList(Array.isArray(data) ? data : []);
        // 최신 글이 가장 위로 오게 정렬
        arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNewsList(arr);
      } catch (e) {
        console.error("Failed to load achievements:", e);
        setNewsList([]);
      }
    })();
  }, []);

  // 총 페이지 수
  const totalPages = Math.max(1, Math.ceil(newsList.length / PAGE_SIZE));

  // 현재 페이지가 총 페이지 수를 넘지 않도록 조정
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // 현재 페이지 아이템
  const pageItems = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    return newsList.slice(startIdx, endIdx);
  }, [newsList, page]);

  //현재 페이지 그룹
  const groupIndex = Math.floor((page - 1) / GROUP_SIZE);
  const groupStart = groupIndex * GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + GROUP_SIZE - 1, totalPages);
  const pagesInGroup = Array.from(
    { length: groupEnd - groupStart + 1 },
    (_, i) => groupStart + i
  );

  const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  const goNextGroup = () => goToPage(groupEnd + 1);
  const goPrevGroup = () => goToPage(groupStart - 1);
  const goFirst = () => goToPage(1);
  const goLast = () => goToPage(totalPages);

  return (
    <div className="news">
      <h1 className="news_title">연구실 성과</h1>
      <div className="news_container">
        <div className="news_wrapper">
          <ul className="news_items">
            {pageItems.map((item) => {
              const firstImg = pickFirstImage(item);
              const year = pickYear(item);
              return (
                <NewsComponent
                  key={item.id}
                  src={toImg(firstImg)}
                  text={item.title}
                  label={year}
                  path={`/achievements/${item.id}`}
                />
              );
            })}
          </ul>
        </div>
      </div>
      {/* 페이지네이션 바 */}
      {totalPages >= 1 && (
        <nav className="pagination" aria-label="news pagination">
          <button
            className="page-btn"
            onClick={goFirst}
            disabled={page === 1}
            aria-label="처음 페이지"
          >
            «
          </button>
          <button
            className="page-btn"
            onClick={goPrevGroup}
            disabled={groupStart === 1}
            aria-label="이전 10페이지"
          >
            ‹
          </button>

          {/* 숫자 버튼 */}
          {pagesInGroup.map((p) => (
            <button
              key={p}
              className={`page-btn ${p === page ? "active" : ""}`}
              onClick={() => goToPage(p)}
            >
              {p}
            </button>
          ))}

          {/* 오른쪽 컨트롤: 다음/마지막 그룹 */}
          <button
            className="page-btn"
            onClick={goNextGroup}
            disabled={groupEnd === totalPages}
            aria-label="다음 10페이지"
          >
            ›
          </button>
          <button
            className="page-btn"
            onClick={goLast}
            disabled={page === totalPages}
            aria-label="마지막 페이지"
          >
            »
          </button>
        </nav>
      )}

      <Footer />
    </div>
  );
}

export default News;
