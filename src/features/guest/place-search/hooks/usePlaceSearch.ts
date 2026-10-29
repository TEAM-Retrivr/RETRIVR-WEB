import { useEffect, useState } from "react";
import { useOrganizationSearch } from "../../../../hooks/queries/useClientQueries";

const SEARCH_DELAY_MS = 250;

export const usePlaceSearch = (query: string) => {
  const keyword = query.trim();
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, SEARCH_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [keyword]);

  const search = useOrganizationSearch(debouncedKeyword);
  const isWaitingForInput = keyword !== debouncedKeyword;

  return {
    keyword,
    organizations:
      keyword && !isWaitingForInput ? (search.data?.organizations ?? []) : [],
    isLoading: Boolean(keyword) && (isWaitingForInput || search.isLoading),
    isError:
      Boolean(keyword) && !isWaitingForInput && search.isError && !search.data,
  };
};
