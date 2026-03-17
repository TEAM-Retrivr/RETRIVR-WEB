import { useState } from "react";
import { Modal } from "../../../Modal";
import CustomCheckBox from "../../../CustomCheckbox";
import Button from "../../../Button";

interface ReturnApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const ReturnApprovalModal = ({ isOpen, onClose }: ReturnApprovalModalProps) => {
  const [isGuaranteedReturned, setIsGuaranteedReturned] = useState(false);
  const [isItemConditionChecked, setIsItemConditionChecked] = useState(false);
  const [adminName, setAdminName] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="반납 처리를 하시겠어요?">
      <div className="flex flex-col w-full mt-6.5 gap-6">
        {/* 체크 영역 - 보증 물품 반환, 물품 상태 확인 */}
        <div className="flex flex-col gap-1.5">
          {/* 보증 물품 반환 체크 */}
          <div className="flex w-full h-13 justify-between items-center px-5 py-3.5  border border-neutral-gray-5 rounded-[10px]">
            <div className="">
              <div>
                <span className="text-14px text-neutral-gray-1 font-bold">
                  보증 물품을 반환했어요.
                </span>
                <span className="text-14px text-primary font-bold ml-1">*</span>
              </div>
              <p className=""></p>
            </div>
            <CustomCheckBox
              checked={isGuaranteedReturned}
              onCheckedChange={(checked) => setIsGuaranteedReturned(checked)}
            />
          </div>
          {/* 물품 상태 확인 체크 */}
          <div className="flex w-full h-13 justify-between items-center px-5 py-3.5  border border-neutral-gray-5 rounded-[10px]">
            <div className="">
              <div>
                <span className="text-14px text-neutral-gray-1 font-bold">
                  물품 상태를 확인했어요.
                </span>
                <span className="text-14px text-primary font-bold ml-1">*</span>
              </div>
              <p className=""></p>
            </div>
            <CustomCheckBox
              checked={isItemConditionChecked}
              onCheckedChange={(checked) => setIsItemConditionChecked(checked)}
            />
          </div>
        </div>
        {/* 승인 관리자 입력 */}
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
              className="w-full h-12 px-3.5 py-3 bg-[#F8F9F9] text-14px text-neutral-gray-1 align-center rounded-small placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] focus:ring-2 focus:ring-secondary-2"
            />
          </div>
        </div>
        {/* 버튼 영역 */}
        <div className="flex w-full justify-between ">
          <Button variant="outline" size="md">
            취소
          </Button>
          <Button variant="primary" size="md">
            반납
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReturnApprovalModal;
