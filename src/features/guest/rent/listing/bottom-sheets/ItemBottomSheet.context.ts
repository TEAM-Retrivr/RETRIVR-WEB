import { createContext, useContext } from "react";

export type RequestClose = (afterClose?: () => void) => void;
export const ItemBottomSheetCloseContext = createContext<RequestClose | null>(
  null,
);

export const useItemBottomSheetClose = (): RequestClose => {
  const close = useContext(ItemBottomSheetCloseContext);
  return close ?? ((afterClose) => afterClose?.());
};
