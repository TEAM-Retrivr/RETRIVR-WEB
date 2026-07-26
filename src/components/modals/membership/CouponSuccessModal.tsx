import { Modal } from "../../Modal";

type CouponSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CouponSuccessModal = ({ isOpen, onClose }: CouponSuccessModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    showTitle={false}
    showCloseButton={false}
    modalClassName="!w-[338px] !rounded-[24px] !px-6 !pt-9 !pb-6 shadow-[0_0_16px_-6px_rgba(0,0,0,0.2)]"
  >
    <div className="flex w-full flex-col items-center font-[Pretendard]">
      <img
        src="/icons/modal-check.svg"
        alt=""
        width={34}
        height={34}
        className="size-[34px]"
        aria-hidden
      />

      <p className="mt-4 text-center text-20px font-semibold leading-[1.4] text-neutral-gray-1">
        쿠폰이 등록되었어요
      </p>
      <p className="mt-1 text-center text-14px font-normal leading-[1.4] text-primary">
        이용권 목록에서 등록된 쿠폰을 확인할 수 있어요
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-10 flex h-12 w-full max-w-[290px] items-center justify-center rounded-[12px] bg-primary text-18px font-bold text-neutral-white shadow-[0_0_4px_rgba(181,244,255,0.5)] cursor-pointer hover:bg-secondary-2 transition-colors"
      >
        확인
      </button>
    </div>
  </Modal>
);

export default CouponSuccessModal;
