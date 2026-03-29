import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const RentalConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Header></Header>
      <div></div>
      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate("/client-home")}
      >
        확인
      </Button>
    </Layout>
  );
};

export default RentalConfirmationPage;
