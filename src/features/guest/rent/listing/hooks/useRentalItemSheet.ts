import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { requestItemDetail } from "../../../../../api/client/client.api";
import type { ItemDetailResponse } from "../../../../../api/client/client.type";
import type { RentalItem } from "../types";

type Scope = { organizationId: number };
type Selection = {
  scope: Scope;
  item: RentalItem;
  detail: ItemDetailResponse;
};
type Pending = { scope: Scope; itemId: number };
type LoadError = Pending & { message: string };

export const useRentalItemSheet = (organizationId: number) => {
  const queryClient = useQueryClient();
  const scope = useMemo(() => ({ organizationId }), [organizationId]);
  const requestId = useRef(0);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [error, setError] = useState<LoadError | null>(null);

  useEffect(() => {
    return () => {
      requestId.current += 1;
    };
  }, [scope]);

  const open = useCallback(
    async (item: RentalItem) => {
      const currentRequest = ++requestId.current;
      setPending({ scope, itemId: item.itemId });
      setError(null);
      setSelection(null);
      try {
        const detail = await queryClient.fetchQuery({
          queryKey: ["clientItemDetail", item.itemId],
          queryFn: () => requestItemDetail(item.itemId),
          staleTime: 0,
          retry: false,
        });
        if (currentRequest !== requestId.current) return;
        if (
          detail.itemManagementType !== "UNIT" &&
          detail.itemManagementType !== "NON_UNIT"
        ) {
          throw new Error("물품의 대여 방식을 확인할 수 없습니다.");
        }
        // 열린 동안은 준비된 데이터를 유지해 재조회에 의한 높이 변경을 막는다.
        setSelection({ scope, item, detail });
      } catch (cause) {
        if (currentRequest !== requestId.current) return;
        setError({
          scope,
          itemId: item.itemId,
          message:
            cause instanceof Error &&
            cause.message === "물품의 대여 방식을 확인할 수 없습니다."
              ? cause.message
              : "물품 정보를 불러오지 못했습니다. 다시 시도해주세요.",
        });
      } finally {
        if (currentRequest === requestId.current) setPending(null);
      }
    },
    [scope, queryClient],
  );

  const close = useCallback(() => {
    requestId.current += 1;
    setSelection(null);
    setPending(null);
    setError(null);
  }, []);

  return {
    open,
    close,
    selection: selection?.scope === scope ? selection : null,
    pendingItemId: pending?.scope === scope ? pending.itemId : null,
    error: error?.scope === scope ? error : null,
  };
};
