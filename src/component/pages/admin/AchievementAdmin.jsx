import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../config/api";

const adminForm = `
.form-wrap {
    margin: 8px 0 20px;
}

.form-wrap h1 {
    color: #fff;
    margin: 0 0 12px;
    font-size: 22px;
    font-weight: 700;
}

.admin-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 720px;
    padding: 16px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

/*
 * ====================================
 * 2. 폼 레이아웃 (Grid)
 * ====================================
 */
.admin-form .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* 기본 2열 그리드 */
    gap: 12px 16px;
}

.admin-form .form-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.admin-form .form-row.full {
    grid-column: 1 / -1; /* 전체 너비 사용 */
}

/*
 * ====================================
 * 3. 폼 요소 스타일 (Label, Input, Textarea)
 * ====================================
 */
.admin-form label {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

/* Input, Textarea 공통 스타일 */
.admin-form input,
.admin-form textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    color: #111827;
    background: #fff;
    transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease;
    box-sizing: border-box;
}

.admin-form input::placeholder,
.admin-form textarea::placeholder {
    color: #9ca3af;
}

/* 포커스 효과 */
.admin-form input:focus,
.admin-form textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, .15);
}

.admin-form textarea {
    min-height: 140px;
    line-height: 1.45;
}

/*
 * ====================================
 * 4. 특수 입력 필드 및 버튼
 * ====================================
 */

/* 파일 입력 */
.admin-form input[type="file"] {
    padding: 8px;
    background: #f9fafb;
    border-style: dashed; /* 점선 테두리 */
}

/* 제출 버튼 */
.admin-form button[type="submit"] {
    align-self: flex-start;
    padding: 10px 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: #2563eb;
    color: #fff;
    font-weight: 600;
    transition: background-color .15s ease, transform .05s ease;
}

.admin-form button[type="button"] {
    align-self: flex-start;
    padding: 10px 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: #2563eb;
    color: #fff;
    font-weight: 600;
    transition: background-color .15s ease, transform .05s ease;  
}   

.admin-form button[type="submit"]:hover {
    background: #1e40af;
}

.admin-form button[type="button"]:hover {
    background: #1e40af;
}

.admin-form button[type="submit"]:active {
    transform: translateY(1px);
}

.admin-from button[type="button"]:active {
    transform: translateY(1px);
}
/*
 * ====================================
 * 5. URL 리스트 (기존 코드에서는 사용되지 않음, 참고용)
 * ====================================
 */
.admin-form ul {
    list-style: none;
    padding: 8px 10px;
    margin: 8px 0 0;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
}

.admin-form ul li {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid #e5e7eb;
}

.admin-form ul li:last-child {
    border-bottom: none;
}

.admin-form ul li span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.admin-form ul li button {
    padding: 6px 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #f9fafb;
    color: #111827;
    cursor: pointer;
    transition: background-color .15s ease;
}

.admin-form ul li button:hover {
    background: #eef2f7;
}

/*
 * ====================================
 * 6. 목록/카드 스타일 (Admin Grid)
 * ====================================
 */
.admin-grid {
    list-style: none;
    padding: 0;
    margin: 0;
    /* 그리드는 그대로 유지 */
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
}

.admin-card {
    /* 카드를 Flex로 설정하고 요소들을 수평으로 나열 */
    display: flex; 
    align-items: center; /* 세로 중앙 정렬 */
    gap: 12px;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.admin-card img {
    /* 썸네일 크기를 고정하고 공간을 차지하도록 설정 */
    width: 72px; 
    height: 72px;
    object-fit: cover;
    border-radius: 8px;
    background: #f3f4f6; /* 이미지가 없을 때 배경색 */
    flex-shrink: 0; /* 크기가 줄어들지 않도록 */
}

/* 제목과 요약이 포함된 컨테이너 */
.admin-card .card-content {
    flex-grow: 1; /* 남은 공간을 채우도록 */
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.admin-card strong {
    color: #111827;
}

.admin-card p {
    margin: 0; /* 마진 초기화 */
    color: #4b5563;
    font-size: 14px;
}

.row-actions {
    /* 수정/삭제 버튼 컨테이너를 수직으로 배열 */
    display: flex; 
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0; /* 크기가 줄어들지 않도록 */
}

.row-actions button {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    color: #111827;
    border-radius: 8px;
    width: 60px; /* 버튼 너비 고정 */
}

.row-actions button:hover {
    background: #eef2f7;
}

/* 썸네일 스타일 (기존 .thumb img 코드는 삭제하고, 클래스에 통합하여 관리) */
.thumb img{
    width: 400px;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
}

/*
 * ====================================
 * 7. 미디어 쿼리 (반응형)
 * ====================================
 */
@media (max-width: 768px) {
    .admin-form .form-grid {
        grid-template-columns: 1fr; /* 모바일에서는 1열 */
    }
}
`;

export default function AchievementsAdmin() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [editing, setEditing] = useState(null);

  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploadPct, setUploadPct] = useState(0);
  const [list, setList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const FILE_BASE = process.env.REACT_APP_API_BASE_URL;

  // 새로 선택된 파일의 미리보기 URL
  const previews = files.map((f) => URL.createObjectURL(f));

  // --- 헬퍼 함수 ---
  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setSummary("");
    setContent("");
    setPublishedAt("");

    previews.forEach((u) => URL.revokeObjectURL(u));
    setFiles([]);
    setExistingImages([]);
  };

  // --- 소식 목록 불러오기 함수 (GET /achievements) ---
  const fetchList = async () => {
    try {
      const response = await api.get("/api/achievements");
      setList(response.data.data || response.data || []);
    } catch (err) {
      console.error("소식 목록 로딩 실패:", err);
    }
  };

  // --- 개별 소식 수정 모드 진입 함수 ---
  const onEdit = (m) => {
    setEditing(m);
    setTitle(m.title || "");
    setSummary(m.summary || "");
    setContent(m.content || "");

    const date = m.publishedAt
      ? new Date(m.publishedAt).toISOString().slice(0, 16)
      : "";
    setPublishedAt(date);

    setFiles([]);
    setExistingImages(
      Array.isArray(m.imageUrls)
        ? m.imageUrls.map((img) =>
            img.startsWith("http") ? img : FILE_BASE + img
          )
        : []
    );
  };

  // --- 초기 로딩 및 쿼리 파라미터 처리 ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get("editId");

    const fetchItemAndEdit = async (id) => {
      try {
        // 소식 단건 조회 API 호출 (GET /achievements/{id} 가정)
        const response = await api.get(`/api/achievements/${id}`);
        const item = response.data;

        if (item) {
          onEdit(item);
          // 쿼리 파라미터 제거하여 URL 정리
          navigate(location.pathname, { replace: true });
        }
      } catch (err) {
        console.error("개별 소식 로딩 실패:", err);
      }
    };

    if (editId) {
      fetchItemAndEdit(editId);
    }

    fetchList();

    return () => {
      // cleanup logic
    };
  }, [location.search]);

  // 파일 선택 → 미리보기
  const onPickFile = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    const valid = picked.filter((f) => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > 5 * 1024 * 1024) return false;
      return true;
    });
    if (valid.length !== picked.length) {
      alert("이미지(5MB 이하)만 업로드됩니다.");
    }
    setFiles((prev) => [...prev, ...valid]);
  };

  // 선택된 파일 제거 (새 파일)
  const removeSelectedFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // 기존 이미지 제거 (수정 모드에서만 사용)
  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- 등록/수정 처리 함수 ---
  const onSubmit = async (e) => {
    e.preventDefault();

    const localPublishedAt = publishedAt || "";

    if (!files.length && !existingImages.length) {
      alert("최소 1개 이상의 이미지를 선택하세요.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("summary", summary.trim());
      fd.append("content", content);
      fd.append("publishedAt", localPublishedAt);

      files.forEach((f) => fd.append("files", f));

      if (editing) {
        const relativeUrls = existingImages.map((img) =>
          img.replace(FILE_BASE, "")
        );
        fd.append("existingImageUrls", JSON.stringify(relativeUrls));
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (ev) => {
          if (!ev.total) return;
          setUploadPct(Math.round((ev.loaded * 100) / ev.total));
        },
      };

      if (editing) {
        await api.put(`/api/admin/achievements/${editing.id}`, fd, config);
        alert("수정되었습니다.");
      } else {
        await api.post("/api/admin/achievements", fd, config);
        alert("등록되었습니다.");
      }

      resetForm();
      fetchList();
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          (editing ? "수정 오류" : "등록 오류") + "가 발생했습니다."
      );
    } finally {
      setUploadPct(0);
    }
  };

  // --- 삭제 처리 함수 (DELETE /admin/achievements/{id}) ---
  const onDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await api.delete(`/api/admin/achievements/${id}`);
      alert("삭제되었습니다.");
      fetchList();
      if (editing?.id === id) {
        resetForm();
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      alert(err?.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  return (
    <div>
      <style>{adminForm}</style>
      <div className="form-wrap">
        <h1>성과 {editing ? "수정" : "등록"}</h1>
        <form className="admin-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="form-row full">
              <label htmlFor="title">제목</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            {/* ... (summary, content, publishedAt 입력 필드 생략) ... */}

            <div className="form-row full">
              <label htmlFor="summary">요약</label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
            </div>

            <div className="form-row full">
              <label htmlFor="content">내용</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="publishedAt">게시일</label>
              <input
                type="datetime-local"
                id="publishedAt"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </div>

            <div className="form-row full">
              <label>이미지 파일 업로드(선택)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onPickFile}
              />

              {/* 기존 이미지 미리보기 (수정 모드) */}
              {editing && existingImages.length > 0 && (
                <div className="upload-previews">
                  {existingImages.map((src, idx) => (
                    <div key={`existing-${idx}`} className="thumb">
                      <img src={src} alt={`existing-preview-${idx}`} />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                      >
                        제거
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 새로 선택된 파일 미리보기 */}
              {previews.length > 0 && (
                <div className="upload-previews">
                  {previews.map((src, idx) => (
                    <div key={`new-${idx}`} className="thumb">
                      <img src={src} alt={`preview-${idx}`} />
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(idx)}
                      >
                        제거
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadPct > 0 && (
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>
                  업로드 {uploadPct}%
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: "10px" }}>
            <button type="submit">{editing ? "수정" : "등록"}</button>
            {editing && (
              <button type="button" onClick={resetForm}>
                취소
              </button>
            )}
          </div>
        </form>

        <h1 style={{ marginTop: 40 }}>소식 목록</h1>
        <ul className="admin-grid">
          {list.map((m) => (
            <li key={m.id} className="admin-card">
              <div className="card-content">
                <strong>{m.title || "(제목 없음)"}</strong>
                <p>{m.summary || "(요약 없음)"}</p>
              </div>
              <div className="row-actions">
                <button onClick={() => onEdit(m)}>수정</button>
                <button onClick={() => onDelete(m.id)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
