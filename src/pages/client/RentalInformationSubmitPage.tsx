import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { FormEvent } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CommonInput from "../../components/CommonInput";
import { ConsentSectionCard } from "../../components/cards/client/ConsentSectionCard";
import Button from "../../components/Button";
import { useSendRentalRequest } from "../../hooks/queries/useClientQueries";

const label1 =
  "대여 물품 연체 시 독촉 문자가 카카오톡으로\n발송됩니다. 이에 동의하시나요?";

const label2 = "대여 시 ";
const label3 =
  "을 맡기셔야 합니다.\n물품 반납 시 반환됩니다. 이에 동의하시나요?";

// TODO: 실제로는 ClientHome에서 대여하기 클릭 시 location.state로 itemId 전달
const DEFAULT_ITEM_ID = 1;
const DEFAULT_GUARANTEED_GOODS = "학생증 또는 신분증";

const RentalInformationSubmitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    itemId?: number;
    itemUnitId?: number;
  } | null;
  const itemId = state?.itemId ?? DEFAULT_ITEM_ID;
  const itemUnitId = state?.itemUnitId; // 개별 코드형 물품일 때만 전달

  // 대여자 이름 : string
  const [name, setName] = useState("");
  // 대여자 전화번호 : string
  const [phoneNumber, setPhoneNumber] = useState("");
  // 대여자 학과 (전공) : string
  const [major, setMajor] = useState("");
  // 대여자 학번 : string
  const [studentId, setStudentId] = useState("");
  // 요청 사항 : string
  const [requestment, setRequestment] = useState("");

  // 개인 정보 활용 동의 체크 여부 : boolean
  const [firstConsentChecked, setFirstConsentChecked] = useState(false);
  const [secondConsentChecked, setSecondConsentChecked] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !phoneNumber.trim() ||
      !major.trim() ||
      !studentId.trim()
    ) {
      alert("필수 항목(이름, 연락처, 학과, 학번)을 모두 입력해주세요.");
      return;
    }
    handleSendRentalRequest();
  };

  const { mutate: sendRentalRequest, isPending } = useSendRentalRequest();

  const handleSendRentalRequest = () => {
    // POST /api/public/v1/items/{itemId}/rentals 의 Request Body
    const body = {
      itemUnitId,
      name,
      phone: phoneNumber.trim() || undefined,
      renterFields: {
        학과: major.trim(),
        학번: studentId.trim(),
        보증물품: DEFAULT_GUARANTEED_GOODS,
        ...(requestment.trim() && { 요청사항: requestment.trim() }),
      },
    };

    sendRentalRequest(
      {
        itemId,
        ...body,
      },
      {
        onSuccess: () => {
          alert("대여 요청이 접수되었습니다.");
          navigate("/client-home");
        },
        onError: () => {
          alert("대여 요청에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };
  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <Header name="대여지명" pageName="대여 정보 입력"></Header>
        <div className="w-full max-w-[360px] max-h-[176px] font-[Pretendard] bg-secondary-4 rounded-[16px] mt-6 mx-5">
          <div className="pt-7.25 pl-8 pb-7.75">
            <div className="flex flex-col">
              <p className="text-neutral-gray-1 text-24px font-[700]">
                c타입 충전기
              </p>
              <p className="text-neutral-gray-2 text-16px font-[500] leading-none">
                c타입 충전기(1)
              </p>
            </div>
            <ul className="text-12px text-neutral-gray-3 font-[400] mt-4.25 leading-[130%]">
              <li>
                대여 기간 : <span className="text-primary">3일</span>
              </li>
              <li>
                보증 물품 :{" "}
                <span className="text-primary">학생증 또는 신분증</span>
              </li>
              <li>
                물품 설명 : <span>어댑터 미포함</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full flex flex-col font-[Pretendard] mt-7.5 px-8 gap-7.5">
          <div>
            <div className="text-neutral-gray-2 text-14px font-[700] mb-2.5">
              <p className="inline ">이름</p>
              <p className="inline text-primary">*</p>
            </div>
            <CommonInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              inputSize="large"
              className="placeholder:text-14px placeholder:font-[400] placeholder:leading-[120%]"
            ></CommonInput>
          </div>
          <div>
            <div className=" text-neutral-gray-2 text-14px font-[700] ">
              <p className="inline">연락처</p>
              <p className="inline text-primary">*</p>
              <p className="text-neutral-gray-3 text-12px font-[400] mt-1.5 mb-2.5 leading-none">
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
              className="placeholder:text-14px placeholder:font-[400] placeholder:leading-[120%]"
            ></CommonInput>
          </div>
          <div>
            <div className="text-neutral-gray-2 text-14px font-[700] mb-2.5">
              <p className="inline">학과</p>
              <p className="inline text-primary">*</p>
            </div>
            <CommonInput
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="공식 명칭을 사용해주세요. ex) 컴공(X), 컴퓨터공학부(O)"
              inputSize="large"
              className="placeholder:text-14px placeholder:font-[400] placeholder:leading-[120%]"
            ></CommonInput>
          </div>
          <div>
            <div className="text-neutral-gray-2 text-14px font-[700] mb-2.5">
              <p className="inline">학번</p>
              <p className="inline text-primary">*</p>
            </div>
            <CommonInput
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="202312680"
              inputSize="large"
              className="placeholder:text-14px placeholder:font-[400] placeholder:leading-[120%]"
            ></CommonInput>
          </div>
          <div>
            <p className="text-neutral-gray-2 text-14px font-[700] mb-2.5">
              요청사항
            </p>
            <CommonInput
              type="text"
              value={requestment}
              onChange={(e) => setRequestment(e.target.value)}
              placeholder="요청사항을 입력하세요. ex) 반납기한 연장"
              inputSize="large"
              className="placeholder:text-14px placeholder:font-[400] placeholder:leading-[120%]"
            ></CommonInput>
          </div>
          {/* 개인 정보 동의 영역 */}
          <div>
            <p className="text-18px text-secondary-2 opacity-[0.9] font-[700]">
              개인 정보 동의
            </p>
            <div className="flex flex-col mt-4 gap-3.5">
              <ConsentSectionCard
                label={label1}
                checked={firstConsentChecked}
                onCheckedChange={setFirstConsentChecked}
              ></ConsentSectionCard>
              <ConsentSectionCard
                label={label2 + "대여물품" + label3}
                checked={secondConsentChecked}
                onCheckedChange={setSecondConsentChecked}
              ></ConsentSectionCard>
            </div>
          </div>
        </div>
        {/* 요청하기 영역 */}
        <div className="flex flex-col w-full items-center mt-13 mb-11 gap-1.5">
          <p className="text-primary text-10px font-[400] leading-[130%]">
            관리자 승인 후 대여가 완료됩니다.
          </p>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={
              !firstConsentChecked || !secondConsentChecked || isPending
            }
          >
            대여 요청하기
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default RentalInformationSubmitPage;
