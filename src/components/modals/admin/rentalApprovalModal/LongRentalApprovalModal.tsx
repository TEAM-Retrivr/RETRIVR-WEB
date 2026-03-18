import { useState } from "react";
import { Modal } from "../../../Modal";
import CustomCheckBox from "../../../CustomCheckbox";
import Button from "../../../Button";
import {
  useApproveAdminRental,
  useRejectAdminRental,
} from "../../../../hooks/queries/useAdminQueries";

interface LongRentalApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LongRentalApprovalModal = ({
  isOpen,
  onClose,
}: LongRentalApproveModalProps) => {
  const [isGuaranteedChecked, setIsGuaranteedChecked] = useState(false);
  const [adminName, setAdminName] = useState("");
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="요청을 승인하시겠어요?">
      {/* 전체 영역 */}
      <div className="flex flex-col w-full gap-8">
        {/* 대여정보 & 체크 & 승인 관리자 영역 */}
        <div className="flex flex-col pt-6.5 gap-5 font-[Pretendard]">
          {/* 대여 정보 영역 */}
          <div className="w-full h-61.25 px-3 pt-6 pb-5 border-1 border-secondary-5 rounded-[18px]">
            {/* 대여 물품 정보 */}
            <div className="flex flex-col w-full border-b-1 border-neutral-gray-5 px-4.5 gap-2.5">
              <p className="text-10px text-primary font-normal leading-[130%]">
                요청 시각 2026-02-17 16:20:03
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <div className="flex gap-1">
                    <p className="text-20px text-neutral-gray-1 font-[600] leading-[140%]">
                      c타입 충전기
                    </p>
                    <p className="text-12px text-neutral-gray-3 font-normal leading-[140%] mt-auto mb-1">
                      (3/5)
                    </p>
                  </div>
                  <p className="text-14px text-neutral-gray-1 font-[600] leading-[20px]">
                    c타입 충전기(1)
                  </p>
                </div>
                <div className="flex flex-col px-1.75 pb-4.25">
                  <p className="text-14px text-neutral-gray-1 opacity-[0.9] leading-[140%]">
                    • 대여 기간: 3일
                  </p>
                  <p className="text-14px text-neutral-gray-1 opacity-[0.9] leading-[140%]">
                    • 보증 물품 O: 신분증 or 학생증
                  </p>
                </div>
              </div>
            </div>
            {/* 대여자 정보 */}
            <div className="flex flex-col w-full text-12px text-secondary-1 font-normal leading-[140%] px-4.5 pt-3">
              <p>이름:</p>
              <p>학과:</p>
              <p>학번:</p>
            </div>
          </div>
          {/* 체크박스 영역 - 보증물품 확인 여부 체크 */}
          <div className="flex w-full h-13 justify-between items-center px-5 py-3.5  border border-neutral-gray-5 rounded-[10px]">
            <div className="">
              <div>
                <span className="text-14px text-neutral-gray-1 font-bold">
                  보증 물품을 확인했어요.
                </span>
                <span className="text-14px text-primary font-bold ml-1">*</span>
              </div>
            </div>
            <CustomCheckBox
              checked={isGuaranteedChecked}
              onCheckedChange={(checked) => setIsGuaranteedChecked(checked)}
            />
          </div>
          {/* 승인 관리자 입력 영역 */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-14px font-bold text-neutral-gray-1">
                승인 관리자 입력{" "}
                <span className="text-14px text-primary font-700 ml-0.5">
                  *
                </span>
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="이름을 입력해주세요"
                className="w-full h-12 px-3.5 py-3 bg-[#F8F9F9] align-center rounded-small placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
              />
            </div>
          </div>
        </div>
        {/* 버튼 영역 - 거부, 승인 버튼 */}
        <div className="flex justify-between w-full">
          <Button variant="outline" size="md">
            거부
          </Button>
          <Button variant="primary" size="md">
            승인
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LongRentalApprovalModal;
