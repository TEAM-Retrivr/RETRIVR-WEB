import { useEffect, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  ADMIN_SESSION_INVALIDATED_EVENT,
  clearAdminSession,
  getAdminSessionExpiresAt,
  hasValidAdminSession,
} from "../utils/adminSession";

const subscribeToAdminSession = (onChange: () => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const checkSession = () => {
    clearTimeout(timer);
    onChange();

    const remaining = getAdminSessionExpiresAt() - Date.now();
    if (remaining > 0) {
      // 브라우저 타이머의 최대 지연 시간을 넘는 토큰도 안전하게 재확인한다.
      timer = setTimeout(checkSession, Math.min(remaining + 1, 2_147_483_647));
    }
  };

  window.addEventListener("storage", checkSession);
  window.addEventListener("focus", checkSession);
  window.addEventListener(ADMIN_SESSION_INVALIDATED_EVENT, checkSession);
  checkSession();

  return () => {
    clearTimeout(timer);
    window.removeEventListener("storage", checkSession);
    window.removeEventListener("focus", checkSession);
    window.removeEventListener(ADMIN_SESSION_INVALIDATED_EVENT, checkSession);
  };
};

const AdminAuthGate = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const isAuthenticated = useSyncExternalStore(
    subscribeToAdminSession,
    hasValidAdminSession,
    () => false,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      clearAdminSession();
      queryClient.clear();
    }
  }, [isAuthenticated, queryClient]);

  if (isAuthenticated) return <Outlet />;

  const nextPath = `${location.pathname}${location.search}`;
  return <Navigate to="/login" replace state={{ nextPath }} />;
};

export default AdminAuthGate;
