import { useNavigate } from "react-router-dom";
import { PageLayout } from "../../../common/layouts/PageLayout";
import { CommonHeader } from "../../../common/components/header/CommonHeader";
import { DescriptionInfo } from "../components/description/DescriptionInfo";
import { NavigationCard } from "../components/navigation/NavigationCard";
import { NavigationButton } from "../components/navigation/NavigationButton";
import HomeShortcut from "../components/home-shortcut/HomeShortcut";
import returnManagementIcon from "../assets/return-management.svg";
import itemManagementIcon from "../assets/item-management.svg";
import lockerManagementIcon from "../assets/locker-management.svg";
import TestIcon from "../assets/test-icon.svg";
import {
  InformationSection,
  NavigationButtonGroup,
  NavigationCardGroup,
} from "./AdminHomePage.styles";

const AdminHomePage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <CommonHeader />
      <InformationSection>
        <DescriptionInfo
          icon={<img src={TestIcon} alt="프로필 아이콘" />}
          name="건국대학교 도서관자치위원회"
          description="건국대학교 도서관 물품 대여소입니다. 대여 시 학생증 또는 신분증 필수."
        ></DescriptionInfo>
      </InformationSection>
      <NavigationButtonGroup>
        <NavigationButton label="계정 관리" onClick={() => navigate("")} />
        <NavigationButton label="대여지 QR" onClick={() => navigate("")} />
      </NavigationButtonGroup>
      <NavigationCardGroup>
        <NavigationCard
          icon={<img src={returnManagementIcon} alt="" />}
          label="반납 관리"
          onClick={() => navigate("")}
        />
        <NavigationCard
          icon={<img src={itemManagementIcon} alt="" />}
          label="물품 관리"
          onClick={() => navigate("")}
        />
        <NavigationCard
          icon={<img src={lockerManagementIcon} alt="" />}
          label="사물함 관리"
          onClick={() => navigate("")}
        />
      </NavigationCardGroup>
      <HomeShortcut></HomeShortcut>
    </PageLayout>
  );
};

export default AdminHomePage;
