import { useEffect, useState } from "react";
import api from "../../../config/api";

const membersStyles = `
.admin-form { 
  display:flex; 
  flex-direction:column; 
  gap:10px; 
  max-width:720px; 
  padding:16px; 
  margin:12px 0 20px; 
  background:#fff; 
  border:1px solid #e5e7eb; 
  border-radius:10px; 
  box-shadow:0 4px 14px rgba(0,0,0,0.05); 
}

.admin-form input {
  width:80%;
  padding:10px 12px;
  border:1px solid #d1d5db; 
  border-radius:8px; 
  font-size:14px; 
  transition:border-color .15s,
  box-shadow .15s; 
}

.admin-form input:focus { 
  outline:none; 
  border-color:#3b82f6; 
  box-shadow:0 0 0 3px rgba(59,130,246,.15); 
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.btn {
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  border: 1px solid transparent;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-primary:hover { 
  background:#1e40af; 
}

.btn-secondary {
  background: #f3f4f6;
  color: #111827;
  border-color: #d1d5db;
}

.btn-secondary:hover { 
  background:#e5e7eb; 
}

.admin-form button { 
  align-self:flex-start; 
  flex-display: column; 
  padding:10px 14px; 
  border:none; 
  border-radius:8px; 
  cursor:pointer; 
  background:#2563eb; 
  color:#fff; 
  font-weight:600; 
  transition:.15s; 
}

.admin-form button:hover { 
  background:#1e40af; 
}

.admin-form button:active { 
  transform: translateY(1px); 
}

.upload-row { 
  display:flex; 
  align-items:center; 
  gap:12px; 
  flex-wrap:wrap; 
}

.upload-preview { 
  width:80px; 
  height:80px; 
  border-radius:10px; 
  object-fit:cover; 
  background:#f3f4f6; 
  border:1px solid #e5e7eb; 
}

.help { 
  font-size:12px; 
  color:#6b7280;
  margin-top:-6px; 
 }


.admin-grid { 
  list-style:none; 
  padding:0;
  margin:0; 
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); 
  gap:16px;
}

.admin-card { 
  display:flex; 
  gap:12px; 
  align-items:flex-start; 
  padding:12px; 
  border:1px solid #e5e7eb; 
  border-radius:10px; 
  background:#fff; 
  box-shadow:0 2px 8px rgba(0,0,0,0.04); 
}

.admin-card img {
  width:72px; 
  height:72px; 
  object-fit:cover; 
  border-radius:8px; 
  background:#f3f4f6; 
  flex-shrink:0; 
 }

.admin-card strong { 
  color:#111827; 
}

.admin-card p { 
  margin:4px 0 8px; 
  color:#4b5563; 
  font-size:14px; 
}

.row-actions {
  display:flex;
  gap:8px; 
}

.row-actions button { 
  padding:8px 12px; 
  border:1px solid #d1d5db; 
  background:#f9fafb; 
  color:#111827; 
  border-radius:8px; 
}

.row-actions button:hover { 
  background:#eef2f7; 
}

.memberTitle{ 
  color:#fff; 
}

.progress { 
  font-size:12px; 
  color:#6b7280; 
}
`;

export default function MembersAdmin() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    engName: "",
    grade: "",
    interests: "",
    papers: "",
    orderNumber: 0,
    photoUrl: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadPct, setUploadPct] = useState(0);

  const FILE_BASE = process.env.REACT_APP_API_BASE_URL || "";

  const toImgSrc = (u) => {
    if (!u) return "/images/member/default.jpg";
    if (/^https?:\/\//i.test(u)) return u;
    const base = (FILE_BASE || "").replace(/\/$/, "");
    const path = u.startsWith("/") ? u : `/${u}`;
    return `${FILE_BASE}${path}`;
  };

  const fetchList = async () => {
    try {
      console.log("[MembersAdmin] baseURL =", api?.defaults?.baseURL);

      const res = await api.get("/api/researchers", {
        headers: { Accept: "application/json" },
        validateStatus: () => true,
      });

      if (typeof res.data === "string") {
        throw new Error("서버가 JSON 대신 HTML을 반환했습니다. (/researchers)");
      }

      const data = res.data;
      const arr = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data)
        ? data
        : [];

      const sorted = [...arr].sort(
        (a, b) => Number(a?.orderNumber ?? 999) - Number(b?.orderNumber ?? 999)
      );
      setList(sorted);
    } catch (err) {
      console.error("Failed to fetch /researchers", err);
      setList([]);
    }
  };

  useEffect(() => {
    fetchList(); // ✅ 최초 로딩
  }, []);

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/"))
      return alert("이미지 파일만 업로드 가능합니다.");
    if (f.size > 5 * 1024 * 1024) return alert("파일 용량은 최대 5MB 입니다.");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setUploadPct(0);

    const fd = new FormData();
    // 텍스트 필드: 서버 DTO 이름과 정확히 일치
    fd.append("name", form.name ?? "");
    fd.append("engName", form.engName ?? "");
    fd.append("grade", form.grade ?? "");
    fd.append("interests", form.interests ?? "");
    fd.append("papers", form.papers ?? "");
    fd.append("orderNumber", String(Number(form.orderNumber) || 0));

    // 파일/URL 처리 (중복 append 방지)
    if (file) {
      fd.append("file", file); // @RequestPart("file")
    } else if (editing?.photoUrl) {
      fd.append("photoUrl", editing.photoUrl); // 유지 신호(서버 구현에 따라 생략 가능)
    }

    const config = {
      onUploadProgress: (ev) => {
        if (!ev.total) return;
        setUploadPct(Math.round((ev.loaded * 100) / ev.total));
      },
      // FormData는 Content-Type 자동 설정(절대 수동 지정 X)
    };

    if (editing?.id) {
      await api.put(`/api/admin/researchers/${editing.id}`, fd, config);
      alert("멤버 정보가 수정되었습니다.");
    } else {
      await api.post("/api/admin/researchers", fd, config);
      alert("새 멤버가 등록되었습니다.");
    }

    // 초기화 + 재조회
    setEditing(null);
    setForm({
      name: "",
      engName: "",
      grade: "",
      interests: "",
      papers: "",
      photoUrl: "",
      orderNumber: 0,
    });
    setFile(null);
    setPreview("");
    setUploadPct(0);
    await fetchList();
  };

  const onEdit = (m) => {
    setEditing(m);
    setForm({
      name: m.name || "",
      engName: m.engName || "",
      grade: m.grade || "",
      interests: m.interests || "",
      papers: m.papers || "",
      photoUrl: m.photoUrl || "",
      orderNumber: m.orderNumber || 0,
    });
    setFile(null);
    setPreview(toImgSrc(m.photoUrl || ""));
  };

  const onDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    await api.delete(`/api/admin/researchers/${id}`);
    await fetchList();
  };

  return (
    <>
      <style>{membersStyles}</style>
      <div>
        <h2 className="memberTitle">멤버 관리</h2>

        <form onSubmit={onSave} className="admin-form">
          <input
            placeholder="이름(한글)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            placeholder="영문 이름"
            value={form.engName}
            onChange={(e) =>
              setForm((f) => ({ ...f, engName: e.target.value }))
            }
          />
          <input
            placeholder="학년/소속"
            value={form.grade}
            onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
          />
          <input
            placeholder="관심 분야"
            value={form.interests}
            onChange={(e) =>
              setForm((f) => ({ ...f, interests: e.target.value }))
            }
          />
          <input
            placeholder="작성 논문"
            value={form.papers}
            onChange={(e) => setForm((f) => ({ ...f, papers: e.target.value }))}
          />
          <input
            placeholder="정렬순서(숫자)"
            value={form.orderNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, orderNumber: e.target.value }))
            }
          />

          <div className="upload-row">
            <input type="file" accept="image/*" onChange={onPickFile} />
            {preview && (
              <img className="upload-preview" src={preview} alt="preview" />
            )}
          </div>
          {uploadPct > 0 && <div className="progress">업로드 {uploadPct}%</div>}

          <div className="actions">
            <button type="submit" className="btn btn-primary">
              {editing ? "수정" : "등록"}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    name: "",
                    engName: "",
                    grade: "",
                    interests: "",
                    papers: "",
                    photoUrl: "",
                    orderNumber: 0,
                  });
                  setFile(null);
                  setPreview("");
                  setUploadPct(0);
                }}
              >
                취소
              </button>
            )}
          </div>
        </form>

        <ul className="admin-grid">
          {list.map((m) => (
            <li key={m.id} className="admin-card">
              <img src={toImgSrc(m.photoUrl)} alt={m.name} />
              <div>
                <strong>{m.name}</strong>
                <p>{m.grade}</p>
                <div className="row-actions">
                  <button onClick={() => onEdit(m)}>수정</button>
                  <button onClick={() => onDelete(m.id)}>삭제</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
