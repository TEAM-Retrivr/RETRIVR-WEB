import { useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CommonInput from "../../components/CommonInput";
import Button from "../../components/Button";
const RentalInformationSubmitPage = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [major, setMajor] = useState("");
  const [studentId, setStudentId] = useState("");
  const [requestment, setRequestment] = useState("");
  return (
    <Layout>
      <Header name="대여지명" pageName="대여 정보 입력"></Header>
      <div className=""></div>
      <div className="w-full flex flex-col font-[Pretendard] px-8">
        <div>
          <div className="text-neutral-gray-2 text-14px font-[700]">
            <p className="inline">이름</p>
            <p className="inline text-primary">*</p>
          </div>
          <CommonInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            inputSize="large"
          ></CommonInput>
        </div>
        <div>
          <div className="text-neutral-gray-2 text-14px font-[700]">
            <p className="inline">연락처</p>
            <p className="inline text-primary">*</p>
            <p className="text-neutral-gray-3 text-12px font-[400]">
              숫자로만 적어주세요.
            </p>
          </div>
          <CommonInput
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={11}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="01012345678"
            inputSize="large"
          ></CommonInput>
        </div>
        <div>
          <div className="text-neutral-gray-2 text-14px font-[700]">
            <p className="inline">학과</p>
            <p className="inline text-primary">*</p>
          </div>
          <CommonInput
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="공식 명칭을 사용해주세요. ex) 컴공(X), 컴퓨터공학부(O)"
            inputSize="large"
          ></CommonInput>
        </div>
        <div>
          <div className="text-neutral-gray-2 text-14px font-[700]">
            <p className="inline">학번</p>
            <p className="inline text-primary">*</p>
          </div>
          <CommonInput
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="202312680"
            inputSize="large"
          ></CommonInput>
        </div>
        <div>
          <p className="text-neutral-gray-2 text-14px font-[700]">요청사항</p>
          <CommonInput
            type="text"
            value={requestment}
            onChange={(e) => setRequestment(e.target.value)}
            placeholder="요청사항을 입력하세요. ex) 반납기한 연장"
            inputSize="large"
          ></CommonInput>
        </div>
        {/* 개인 정보 동의 영역 */}
        <div>
          <p>개인 정보 동의</p>
        </div>
      </div>
      {/* 요청하기 영역 */}
      <div className="flex flex-col w-full items-center">
        <p></p>
        <Button variant="primary" size="lg">
          대여 요청하기
        </Button>
      </div>
    </Layout>
  );
};

export default RentalInformationSubmitPage;
