import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../../../config/api";

const DetailBox = styled.div`
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  text-align: left;
`;
const Img = styled.img`
  width: 100%;
  max-width: 520px;
  height: auto;
  border-radius: 10px;
  display: block;
  margin: 0 auto 10px;
`;

const ContentCard = styled.section`
  margin-top: 16px;
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);

  /* 본문 타이포그래피 */
  color: #111827;
  line-height: 1.6;
  font-size: 17px;
`;

const FancyList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: item;

  > li {
    position: relative;
    counter-increment: item;
    padding-left: 40px;
    margin: 10px 0;
  }

  /* 동그란 번호 뱃지 */
  > li::before {
    content: counter(item);
    position: absolute;
    left: 0;
    top: 2px;
    width: 26px;
    height: 26px;
    border-radius: 9999px;
    border: 2px solid #111827;
    color: #111827;
    background: #fff;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    display: grid;
    place-items: center;
  }

  /* 리스트 항목 사이 얇은 구분선 (선택) */
  > li + li {
    border-top: 1px dashed #e5e7eb;
    padding-top: 12px;
    margin-top: 12px;
  }
`;

/* 본문 섹션 제목/설명(선택) */
const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 10px;
  color: #111827;
`;

export default function Details() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const FILE_BASE = "http://13.210.0.69:8080";
  const normalizeUrl = (x) => {
    if (!x) return "";
    if (typeof x === "string") return x.trim();
    if (typeof x === "object") {
      return (x.url || x.path || x.src || x.imageUrl || "").toString().trim();
    }
    return String(x).trim();
  };
  const toAbs = (u = "") => {
    const s = normalizeUrl(u);
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    return `${FILE_BASE}${s.startsWith("/") ? "" : "/"}${s}`;
  };
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/achievements/${id}`);
        setDetail(data?.data || data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const images = useMemo(() => {
    if (!detail) return [];
    let raw = detail.imageUrls ?? detail.images ?? detail.imageUrl ?? [];
    // 문자열로 온 경우(예: '["/files/a.jpg"]') 파싱
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        raw = Array.isArray(parsed) ? parsed : [raw];
      } catch {
        raw = [raw];
      }
    }
    if (!Array.isArray(raw)) raw = [raw];
    return raw.map(toAbs).filter(Boolean);
  }, [detail]);

  const lines = useMemo(() => {
    if (!detail) return [];
    if (Array.isArray(detail.body)) return detail.body;
    if (Array.isArray(detail.contents)) return detail.contents;
    if (typeof detail.content === "string")
      return detail.content.split(/\r?\n/).filter(Boolean);
    return [];
  }, [detail]);

  if (loading) return <p>불러오는 중…</p>;
  if (!detail) return <p>세부 정보를 찾을 수 없습니다.</p>;

  return (
    <DetailBox>
      <hr />
      <h1>{detail.title}</h1>
      <p style={{ color: "#666", marginTop: 6 }}>
        {new Date(detail.publishedAt || detail.createdAt).toLocaleDateString()}
      </p>
      <hr />
      <div>
        {images.length === 0 ? (
          <Img src="/images/placeholder.jpg" alt="placeholder" />
        ) : (
          images.map((src, i) => (
            <Img
              key={i}
              src={src}
              alt={`이미지 ${i}`}
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.jpg";
              }}
            />
          ))
        )}
      </div>

      {lines.length > 0 && (
        <ContentCard>
          <SectionTitle>상세 내용</SectionTitle>
          <FancyList>
            {lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </FancyList>
        </ContentCard>
      )}
    </DetailBox>
  );
}
