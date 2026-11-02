import type { AdminBorrowerRequirementResponse } from "../../../../api/admin/admin.type";
import {
  ManagementCard,
  ManagementItemText,
  ManagementItemName,
  ManagementStatusButton,
  ManagementStatusLabel,
  RentalOption,
  RentalOptionName,
  RentalOptionStatus,
  type ManagementStatus,
} from "./ItemStatusCard.styles";

interface CardProps {
  status: ManagementStatus;
  itemName: string;
  itemCode?: string;
  variant?: "management" | "rental-selection";
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  statusLabel?: string;
  /** GET /api/admin/v1/items/{itemId} 상세의 borrowerRequirements */
  borrowerRequirements?: AdminBorrowerRequirementResponse[];
}

const statusLabels: Record<ManagementStatus, string> = {
  rentalAvailable: "대여 가능",
  rentedOut: "대여 중",
  rentalUnavailable: "대여 불가",
};

const ItemStatusCard = ({
  status,
  itemName,
  variant = "management",
  selected = false,
  disabled = false,
  onSelect,
  statusLabel,
}: CardProps) => {
  if (variant === "rental-selection") {
    const unavailable = disabled || status !== "rentalAvailable";
    return (
      <RentalOption
        type="button"
        aria-pressed={selected}
        disabled={unavailable}
        onClick={onSelect}
        $selected={selected}
      >
        <RentalOptionName $selected={selected}>{itemName}</RentalOptionName>
        <RentalOptionStatus $unavailable={unavailable}>
          {statusLabel ?? statusLabels[status]}
        </RentalOptionStatus>
      </RentalOption>
    );
  }

  return (
    <ManagementCard $status={status}>
      <ManagementItemText>
        <ManagementItemName $status={status}>{itemName}</ManagementItemName>
      </ManagementItemText>
      <ManagementStatusButton type="button" $status={status}>
        <ManagementStatusLabel $status={status}>
          {statusLabels[status]}
        </ManagementStatusLabel>
      </ManagementStatusButton>
    </ManagementCard>
  );
};

export default ItemStatusCard;
