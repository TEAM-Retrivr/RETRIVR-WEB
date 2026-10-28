import { PageLayout } from "../../../common/layouts/PageLayout";
import { CommonHeader } from "../../../common/components/header/CommonHeader";
import { useNavigate } from "react-router-dom";
const PlaceSearchPage = () => {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <CommonHeader onClick={() => navigate("/")} />
    </PageLayout>
  );
};

export default PlaceSearchPage;
