import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import TypewriterComponent from "typewriter-effect";
import api from "../../../config/api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ achievements: 0, members: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const boot = async () => {
      try {
        const [ach, mem] = await Promise.all([
          api.get("/api/achievements"),
          api.get("/api/researchers"),
        ]);

        const achArray = ach.data.items || ach.data || [];
        const memArray = mem.data.items || mem.data || [];

        setCounts({
          achievements: Array.isArray(achArray) ? achArray.length : 0,
          members: Array.isArray(memArray) ? memArray.length : 0,
        });

        const recent5 = (Array.isArray(achArray) ? achArray : [])
          .sort(
            (a, b) =>
              new Date(b.publishedAt || b.created_at || b.createdAt || 0) -
              new Date(a.publishedAt || a.created_at || a.createdAt || 0)
          )
          .slice(0, 5);

        setRecent(recent5);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, []);

  const onGoResearchers = async (e) => {
    e.preventDefault();
    try {
      // 미리 한 번 호출 (실패해도 네비게이트는 진행)
      await api.get("/researchers", {
        headers: { Accept: "application/json" },
      });
      console.log("Pre-fetch /researchers succeeded.");
    } catch (_) {}
    navigate("/researchers");
  };

  return (
    <HomeContainer>
      <HomeTitle>CCLab. Admin</HomeTitle>

      <TypewriterBox>
        <TypewriterComponent
          options={{
            strings: [
              "Welcome Admin!",
              "관리자 대시보드에 오신 것을 환영합니다!",
            ],
            autoStart: true,
            loop: true,
            delay: 65,
          }}
        />
      </TypewriterBox>

      <SubTitle>요약</SubTitle>
      <Grid>
        <Card>
          <h3>소식(Achievements)</h3>
          <Muted>게시된 소식 총 개수</Muted>
          <Stat>{loading ? "-" : counts.achievements}</Stat>
          <Row style={{ marginTop: 12 }}>
            <ButtonLink to="/admin/achievements">소식 관리</ButtonLink>
            <GhostLink to="/achievements">사용자 페이지 보기</GhostLink>
          </Row>
        </Card>

        <Card>
          <h3>멤버(Members)</h3>
          <Muted>등록된 연구실 멤버 수</Muted>
          <Stat>{loading ? "-" : counts.members}</Stat>
          <Row style={{ marginTop: 12 }}>
            <ButtonLink to="/admin/members">멤버 관리</ButtonLink>
            <GhostLink to="/researchers" onClick={onGoResearchers}>
              사용자 페이지 보기
            </GhostLink>
          </Row>
        </Card>

        <Card>
          <h3>빠른 작업</h3>
          <Muted>자주 하는 관리 기능 바로가기</Muted>
          <Row>
            <ButtonLink to="/admin/achievements">새 소식 등록</ButtonLink>
            <ButtonLink to="/admin/members">새 멤버 등록</ButtonLink>
          </Row>
        </Card>
      </Grid>

      <SubTitle>최근 소식</SubTitle>
      <Grid>
        <Card style={{ gridColumn: "span 12" }}>
          {recent.length === 0 ? (
            <Muted>등록된 소식이 없습니다.</Muted>
          ) : (
            <List>
              {recent.map((n) => (
                <Item key={n.id}>
                  <Link to={`/admin/achievements?edit=${n.id}`}>
                    {n.title || "(제목 없음)"}
                  </Link>
                  <span className="date">
                    {new Date(
                      n.publishedAt || n.created_at || n.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </Item>
              ))}
            </List>
          )}
        </Card>
      </Grid>
    </HomeContainer>
  );
}

const TypewriterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 2px solid #fff;
  border-radius: 15px;
  width: 100%;
  max-width: 92vw;
  margin: 20px 0;
  font-size: 38px;
  color: #fff;
  background: transparent;
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 카드가 밑에 모이도록 */
  min-height: 100vh;
  background: linear-gradient(90deg, rgb(28, 27, 27) 0%, rgb(26, 23, 23) 100%);
  padding: 60px 20px 80px;
  box-sizing: border-box;
`;

const HomeTitle = styled.h1`
  font-size: 48px;
  margin-bottom: 10px;
  color: #fff;
`;

// 대시보드 섹션 공통 텍스트
const SubTitle = styled.h2`
  color: #e9ecef;
  font-size: 22px;
  margin: 30px 0 14px;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 18px;
  width: 1100px;
  max-width: 92vw;
`;

const Card = styled.div`
  grid-column: span 12;

  @media (min-width: 640px) {
    grid-column: span 6;
  }
  @media (min-width: 1024px) {
    grid-column: span 4;
  }

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 16px;
  padding: 20px;
  color: #fff;
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25);
`;

const Stat = styled.div`
  font-size: 32px;
  font-weight: 800;
  margin-top: 6px;
`;

const Muted = styled.p`
  margin: 6px 0 14px;
  color: #ced4da;
  font-size: 14px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ButtonLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #111;
  background: #fff;

  &:hover {
    opacity: 0.9;
  }
`;

const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  border: 1px dashed rgba(255, 255, 255, 0.35);
  color: #fff;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    color: #fff;
    text-decoration: none;
  }
  span.date {
    color: #adb5bd;
    font-size: 12px;
  }
`;
