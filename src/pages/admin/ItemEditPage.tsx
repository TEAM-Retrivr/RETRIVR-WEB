import { useParams } from "react-router-dom";
import AdminItemFormPage from "./AdminItemFormPage";

const ItemEditPage = () => {
  const { itemId: itemIdParam } = useParams();
  const itemId = Number(itemIdParam);

  return <AdminItemFormPage mode="edit" itemId={itemId} />;
};

export default ItemEditPage;
