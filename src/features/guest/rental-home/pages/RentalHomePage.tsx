import { useSearchParams } from "react-router-dom";
import ClientHomePage from "../../../../pages/client/ClientHomePage";
import { LockerRentalFlow } from "../../locker-rental/LockerRentalFlow";

// type이 없거나 지원하지 않는 값이면 기존 물품 홈을 기본 화면으로 사용한다.
// 물품 홈의 디자인 리뉴얼은 이 사물함 화면 작업과 별도로 연결할 수 있다.
const RentalHomePage = () => {
  const [params] = useSearchParams();
  return params.get("type") === "locker" ? (
    <LockerRentalFlow screen="home" />
  ) : (
    <ClientHomePage />
  );
};

export default RentalHomePage;
