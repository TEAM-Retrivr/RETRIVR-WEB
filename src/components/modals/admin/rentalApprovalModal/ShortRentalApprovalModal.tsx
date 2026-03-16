import { useState } from "react";
import { Modal } from "../../../Modal";
import CustomCheckBox from "../../../CustomCheckbox";
import Button from "../../../Button";
import { useNavigate } from "react-router-dom";

interface ShortRentalApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  // itemData: {
  //   name: string;
  //   borrower: string;
  //   duration: string;
  // };
}

export const ShortRentalApprovalModal = ({
  isOpen,
  onClose,
  // itemData,
}: ShortRentalApproveModalProps) => {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="요청을 승인하시겠어요?">
      <div className="flex flex-col pt-7 gap-4 font-[Pretendard]">
        {/* 보증 물품을 확인했어요 체크 박스 */}
        <div className="flex w-full h-16 justify-between items-center px-5 py-3.5  border border-neutral-gray-5 rounded-[10px]">
          <div className="">
            <div>
              <span className="text-14px text-neutral-gray-1 font-bold">
                보증 물품을 확인했어요.
              </span>
              <span className="text-14px text-primary font-bold ml-1">*</span>
            </div>
            <p className=""></p>
          </div>
          <CustomCheckBox
            checked={true}
            onCheckedChange={() => navigate("/modal-test")}
          />
        </div>

        {/* 2. 승인 관리자 입력 */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-14px font-bold text-neutral-gray-1">
              승인 관리자 입력{" "}
              <span className="text-14px text-primary font-700 ml-0.5">*</span>
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

        {/* 3. 하단 버튼 영역 */}
        <div className="flex gap-3 mt-3">
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
