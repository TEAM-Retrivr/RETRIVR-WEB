import { useSearchParams } from "react-router-dom";
import { LockerRentalFlow } from "../../locker-rental/LockerRentalFlow";
import { RentalPlaceProvider } from "../components/RentalPlaceProvider";
import { getRentalType } from "../routes";
import { ItemRentalHomeRoute } from "./ItemRentalHomeRoute";

// 이름 기반 주소를 내부 대여지 식별자로 해석한 뒤 대여 종류에 맞는 화면을 표시한다.
const RentalHomePage = () => {
  const [params] = useSearchParams();
  return (
    <RentalPlaceProvider>
      {getRentalType(params) === "locker" ? (
        <LockerRentalFlow screen="home" />
      ) : (
        <ItemRentalHomeRoute />
      )}
    </RentalPlaceProvider>
  );
};

export default RentalHomePage;
