import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "./Researchers.css";
import Footer from "../../Footer";

const extractArray = (data) => {
  if (Array.isArray(data)) return data;
  const keys = ["items", "content", "data", "result", "list", "records"];
  for (const k of keys) if (Array.isArray(data?.[k])) return data[k];
  const emb = data?._embedded;
  if (emb && typeof emb === "object") {
    const arr = Object.values(emb).find(Array.isArray);
    if (arr) return arr;
  }
  if (data && typeof data === "object") {
    const arr = Object.values(data).find(Array.isArray);
    if (arr) return arr;
  }
  return [];
};

export default function Researchers() {
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const FILE_BASE = "http://192.168.0.8:8080";
  const toImgSrc = (u) => {
    if (!u) return "/images/member/default.jpg";
    if (/^https?:\/\//i.test(u)) return u;
    const base = FILE_BASE.replace(/\/$/, "");
    const path = u.startsWith("/") ? u : `/${u}`;
    return `${FILE_BASE}${path}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMembers = async () => {
      try {
        console.log("[Researchers] baseURL =", api?.defaults?.baseURL);
        let res = await api.get("/researchers", {
          headers: { Accept: "application/json" },
          validateStatus: () => true, // 상태코드와 무관하게 데이터 확인
        });

        // 3) 만약 baseURL이 비었거나 오작동하면, 절대경로로 한 번 더 시도
        if (typeof res.data === "string" && /^\s*</.test(res.data)) {
          const ABS =
            (typeof import.meta !== "undefined"
              ? import.meta.env?.VITE_API_BASE_URL
              : process.env?.REACT_APP_API_BASE_URL) || "";
          if (ABS) {
            console.warn(
              "[Researchers] fallback to ABS GET",
              `${ABS}/researchers`
            );
            res = await api.get(`${ABS.replace(/\/$/, "")}/researchers`, {
              headers: { Accept: "application/json" },
              validateStatus: () => true,
            });
          }
        }

        if (typeof res.data === "string") {
          throw new Error(
            "서버가 JSON 대신 HTML을 반환했습니다. (경로/컨텐츠협상 확인)"
          );
        }

        const arr = extractArray(res.data);
        const sorted = [...arr].sort(
          (a, b) =>
            Number(a?.orderNumber ?? a?.orderNo ?? 999) -
            Number(b?.orderNumber ?? b?.orderNo ?? 999)
        );

        setResearchers(sorted);
        setErr(sorted.length ? null : "등록된 멤버가 없습니다.");
      } catch (e) {
        console.error("Failed to load /researchers:", e);
        setErr("멤버 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div>
      <h1 className="researchers">학부생 연구원</h1>

      {loading ? (
        <p className="center">불러오는 중…</p>
      ) : err ? (
        <p className="center">{err}</p>
      ) : researchers.length === 0 ? (
        <p className="center">등록된 멤버가 없습니다.</p>
      ) : (
        <div className="researchers_container">
          <div className="container_wrap">
            <div className="researchers_info">
              <ul className="memberWrap">
                {researchers.map((m) => (
                  <li
                    className="memberList"
                    key={m.id ?? `${m.name}-${m.engName}`}
                  >
                    <div className="listBox" />
                    <div className="re_img">
                      <img
                        src={toImgSrc(m.photoUrl)}
                        alt={m.name || m.engName || "member"}
                      />
                    </div>
                    <div className="re_about">
                      <div className="name">
                        <p className="eng">{m.engName || ""}</p>
                        <p className="kor">{m.name || ""}</p>
                      </div>
                      <div className="details">
                        <p className="present">
                          학년:{""}
                          {m.grade || "의료IT공학과 학부생"}
                        </p>
                        <p className="projects">
                          주요 관심분야:{" "}
                          {m.interests ?? m.interest ?? "정보 없음"}
                        </p>
                        {(m.papers ?? m.paper) && (
                          <p className="paper">논문 : {m.papers ?? m.paper}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
