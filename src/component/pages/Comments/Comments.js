import React, { useState, useEffect } from "react";
import "./Styled.css";
import Footer from "../../Footer.js";
export default function Comments() {
  const [result, setResult] = React.useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); /*페이지 이동 시 위로 고정*/

  for (const [k, v] of formData.entries()) {
    console.log(k, "=>", v);
  } // 디버그용 폼 데이터 출력

  const onSubmit = async (event) => {
    event.preventDefault(); /*기본 폼 제출 방지*/
    setResult("보내는 중....");
    const formData = new FormData(event.target);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    }); /* formData를 사용해서 AJAX 요청을 보냄*/

    const data = await response.json();

    if (data.success) {
      setResult("전송이 완료되었습니다.");
      event.target.reset(); /*폼을 전송후 다시 리셋*/
      window.scrollTo(0, 0);
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
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
            <input
              type="hidden"
              name="access_key"
              value="1f6a5173-8b4c-440a-92a1-cf2a7a0edbed"
            />
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
