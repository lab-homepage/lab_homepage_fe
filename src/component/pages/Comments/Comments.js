import React, { useState, useEffect } from "react";
import "./Styled.css";
import Footer from "../../Footer.js";
export default function Comments() {
  const [result, setResult] = React.useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); /*페이지 이동 시 위로 고정*/

  const onSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const studentID = formData.get("studentID");
    const email = formData.get("email");
    const message = formData.get("message");

    const to = "sdkim.mie@sch.ac.kr";

    const subject = `[연구실 문의] ${name} (${studentID}) 학생 문의`;
    const body =
      `교수님 안녕하세요.\n\n` +
      `아래와 같이 문의드립니다.\n\n` +
      `이름: ${name}\n` +
      `학번: ${studentID}\n` +
      `회신 이메일: ${email}\n\n` +
      `문의 내용:\n${message}\n\n` +
      `감사합니다.`;

    const mailtoLink =
      `mailto:${to}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    // 학생 PC/브라우저에 설정된 메일 프로그램(Outlook, Gmail 등) 열기
    window.location.href = mailtoLink;

    setResult("메일 작성 창이 열렸습니다. 메일 창에서 전송을 완료해주세요.");
  };
  return (
    <div>
      <div className="about_us">
        <div className="title_text">
          <h1 className="comment_title">문의사항</h1>
        </div>
        <p className="img">
          <img src="images/about/computer.jpg" alt="computer" />
        </p>
        <div className="about_us_col">
          <h3>문의사항</h3>
          <p>
            컴퓨터 네트워크 연구실에 관심 가지고 문의해 주셔서 감사합니다.
            하단에 위치한 폼에 적어주시면 빠른 시일 내에 답장 드리도록
            하겠습니다. 감사합니다.
          </p>
          <ul>
            <li className="about_things">📧 sdkim.mie@sch.ac.kr</li>
            <li className="about_things">📞 041-530-1690</li>
            <li className="about_things">🏢 의료과학관 1511</li>
            <dd className="about_concern">
              📌 개인 대면 상담이 필요할 시 I-Design 홈페이지를 통해 예약하고
              오시길 바랍니다.
            </dd>
            <dd className="about_register">
              <a href="https://id.sch.ac.kr/Career/Counsel/CounselProfessor.aspx">
                {`👉 예약하러가기`}
              </a>
            </dd>
          </ul>
        </div>
        <div className="contact-form">
          <form onSubmit={onSubmit}>
            <label>이름 </label>
            <input
              type="text"
              name="name"
              placeholder="이름을 적어주세요"
              required
            />
            <label>학번 </label>
            <input
              type="number"
              name="studentID"
              placeholder="학번을 적어주세요"
              required
            />
            <label>이메일 </label>
            <input
              type="text"
              name="email"
              placeholder="회신 받으실 이메일 주소를 적어주세요"
              required
            />
            <label>문의사항 </label>
            <textarea
              name="message"
              rows="15"
              placeholder="문의사항을 적어주세요"
              required
            ></textarea>
            <button type="submit" className="btn dark-btn">
              전송하기 ⇾
            </button>
          </form>
          <span>{result}</span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
