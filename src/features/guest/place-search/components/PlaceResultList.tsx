import placeIcon from "../assets/place-icon.svg";
import {
  MatchText,
  ResultIcon,
  ResultItem,
  ResultList,
  ResultName,
} from "./PlaceResultList.styles";

export type PlaceResult = {
  name: string;
  organizationId?: number;
};

type PlaceResultListProps = {
  places: PlaceResult[];
  keyword: string;
  onSelect: (place: PlaceResult) => void;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const HighlightedName = ({ name, query }: { name: string; query: string }) => {
  if (!query) return <>{name}</>;

  const parts = name.split(new RegExp(`(${escapeRegExp(query)})`, "g"));

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <MatchText key={`${index}-${part}`}>{part}</MatchText>
        ) : (
          <span key={`${index}-${part}`}>{part}</span>
        ),
      )}
    </>
  );
};

export const PlaceResultList = ({
  places,
  keyword,
  onSelect,
}: PlaceResultListProps) => (
  <ResultList>
    {places.map((place) => (
      <ResultItem
        key={place.organizationId ?? place.name}
        type="button"
        searching={Boolean(keyword)}
        onClick={() => onSelect(place)}
      >
        <ResultIcon src={placeIcon} alt="" />
        <ResultName>
          <HighlightedName name={place.name} query={keyword} />
        </ResultName>
      </ResultItem>
    ))}
  </ResultList>
);
