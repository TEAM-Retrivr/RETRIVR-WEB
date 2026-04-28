import { useLocation, useParams } from "react-router-dom";
import AdminItemFormPage from "./AdminItemFormPage";

const ItemEditPage = () => {
  const location = useLocation();
  const { itemId: itemIdParam } = useParams();
  const itemId = Number(itemIdParam);
  const adminCodeVerificationToken = (
    location.state as { adminCodeVerificationToken?: string } | null
  )?.adminCodeVerificationToken;

  return (
    <AdminItemFormPage
      mode="edit"
      itemId={itemId}
      adminCodeVerificationToken={adminCodeVerificationToken}
    />
  );
};

export default ItemEditPage;
