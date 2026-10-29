import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommonHeader } from "../../../common/components/header/CommonHeader";
import { PageLayout } from "../../../common/layouts/PageLayout";
import clearIcon from "../assets/clear-icon.svg";
import leftArrow from "../assets/left-arrow.svg";
import retrivr from "../assets/retrivr.svg";
import searchIcon from "../assets/search-icon.svg";
import {
  PlaceResultList,
  type PlaceResult,
} from "../components/PlaceResultList";
import { usePlaceSearch } from "../hooks/usePlaceSearch";
import {
  ClearButton,
  Heading,
  Intro,
  Mascot,
  SearchBar,
  SearchContent,
  SearchInput,
  SearchMessage,
  SearchSurface,
  SearchToolButton,
} from "./PlaceSearchPage.styles";

// 검색어가 없을 때는 디자인 시안의 추천 기관을 보여준다.
const suggestedPlaces: PlaceResult[] = [
  { name: "건국대학교 학생회관" },
  { name: "건국대학교 도서자치위원회" },
  { name: "건국대학교 공과대학" },
  { name: "건국대학교 예술디자인대학" },
];

const PlaceSearchPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const { keyword, organizations, isLoading, isError } = usePlaceSearch(query);

  const closeSearch = () => {
    inputRef.current?.blur();
    setIsSearching(false);
    setQuery("");
  };

  const selectPlace = (place: PlaceResult) => {
    if (place.organizationId) {
      navigate(`/client-home?organizationId=${place.organizationId}`);
      return;
    }

    // 추천 항목은 ID가 없는 시안 데이터이므로 같은 이름으로 검색한다.
    setQuery(place.name);
    setIsSearching(true);
    inputRef.current?.focus();
  };

  return (
    <PageLayout>
      <SearchSurface>
        <Intro
          searching={isSearching}
          inert={isSearching}
          aria-hidden={isSearching}
        >
          <CommonHeader onClick={() => navigate("/login")} />
          <Heading>
            대여 기관을
            <br />
            선택해 주세요
          </Heading>
        </Intro>
        <SearchContent searching={isSearching}>
          <SearchBar onClick={() => inputRef.current?.focus()}>
            <SearchToolButton
              type="button"
              searching={isSearching}
              aria-label={isSearching ? "검색 닫기" : "검색 시작"}
              onClick={(event) => {
                event.stopPropagation();
                if (isSearching) closeSearch();
                else inputRef.current?.focus();
              }}
            >
              <img className="search-icon" src={searchIcon} alt="" />
              <img className="back-icon" src={leftArrow} alt="" />
            </SearchToolButton>
            <SearchInput
              ref={inputRef}
              type="search"
              value={query}
              onFocus={() => setIsSearching(true)}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="대여 기관 검색"
              aria-label="대여 기관 검색"
              enterKeyHint="search"
            />
            {isSearching && query && (
              <ClearButton
                type="button"
                aria-label="검색어 지우기"
                onClick={(event) => {
                  event.stopPropagation();
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <img src={clearIcon} alt="" />
              </ClearButton>
            )}
          </SearchBar>
          {!keyword ? (
            <PlaceResultList
              places={suggestedPlaces}
              keyword=""
              onSelect={selectPlace}
            />
          ) : isLoading ? (
            <SearchMessage role="status">검색 중...</SearchMessage>
          ) : isError ? (
            <SearchMessage role="alert">
              대여 기관을 검색하는 중 오류가 발생했습니다.
            </SearchMessage>
          ) : organizations.length > 0 ? (
            <PlaceResultList
              places={organizations}
              keyword={keyword}
              onSelect={selectPlace}
            />
          ) : (
            <SearchMessage role="status">검색결과가 없습니다</SearchMessage>
          )}
        </SearchContent>
        <Mascot src={retrivr} alt="" />
      </SearchSurface>
    </PageLayout>
  );
};

export default PlaceSearchPage;
