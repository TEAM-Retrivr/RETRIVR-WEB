import {
  ConfirmCardSection,
  Information,
  ItemDetails,
  ItemType,
  ExpiredAt,
  ItemName,
  ContactDetails,
  Name,
  Dot,
  Contact,
  ConfirmButton,
} from "./ConfirmCard.styles";

type ConfirmCardProps = {
  type: "물품" | "사물함";
  expiredAt: string;
  itemName: string;
  name: string;
  contact: string;
};

const ConfirmCard = ({
  type,
  expiredAt,
  itemName,
  name,
  contact,
}: ConfirmCardProps) => {
  return (
    <ConfirmCardSection>
      <Information>
        <ItemDetails>
          <ItemType>{type}</ItemType>
          <ExpiredAt>{expiredAt}</ExpiredAt>
        </ItemDetails>
        <ItemName>{itemName}</ItemName>
        <ContactDetails>
          <Name>{name}</Name>
          <Dot></Dot>
          <Contact>{contact}</Contact>
        </ContactDetails>
      </Information>
      <ConfirmButton>확인하기</ConfirmButton>
    </ConfirmCardSection>
  );
};

export default ConfirmCard;
