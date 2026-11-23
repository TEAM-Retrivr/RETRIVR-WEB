import type { LockerRentalPlace, LockerSelection } from "../types";
import { Summary, SummaryDetails } from "./LockerRequest.styles";

const formatDate = (date: Date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

export const LockerSummaryCard = ({
  selection,
  place,
  startsAt,
}: {
  selection: LockerSelection;
  place: LockerRentalPlace;
  startsAt: Date;
}) => {
  const endsAt = new Date(startsAt);
  endsAt.setDate(endsAt.getDate() + place.rentalDays);
  return (
    <Summary aria-label="선택한 사물함 대여 정보">
      <h2>
        {selection.zone.name} {selection.locker.number}
      </h2>
      <SummaryDetails>
        <div>
          <dt>대여 기간</dt>
          <dd>
            {place.rentalDays}일{" "}
            <span>
              ({place.startDate?.replaceAll("-", ".") ?? formatDate(startsAt)} ~{" "}
              {place.dueDate?.replaceAll("-", ".") ?? formatDate(endsAt)})
            </span>
          </dd>
        </div>
        <div>
          <dt>담보 물품</dt>
          <dd>{place.guaranteedGoods || "없음"}</dd>
        </div>
      </SummaryDetails>
    </Summary>
  );
};
