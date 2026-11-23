import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLockerRental,
  getLockerLayout,
  getLockerRentalForm,
  getLockerRentalStatus,
  getLockerZones,
  isLockerId,
} from "../api/locker.api";
import type { LockerRentalCreateRequest } from "../api/locker.types";
import {
  completeLockerApproval,
  type LockerManagerApproval,
} from "../api/approval.api";
import { getRentalOrganization } from "../api/organization.api";

export const lockerKeys = {
  all: ["renewal", "lockers"] as const,
  zones: (organizationId: number) =>
    ["renewal", "lockers", "zones", organizationId] as const,
  layout: (zoneId: string) => ["renewal", "lockers", "layout", zoneId] as const,
  form: (lockerId: string) => ["renewal", "lockers", "form", lockerId] as const,
  status: (publicId: string) =>
    ["renewal", "lockers", "status", publicId] as const,
};
export const useLockerZones = (organizationId: number) =>
  useQuery({
    queryKey: lockerKeys.zones(organizationId),
    queryFn: ({ signal }) => getLockerZones(organizationId, signal),
    enabled: Number.isSafeInteger(organizationId) && organizationId > 0,
    retry: false,
  });
export const useLockerOrganization = (organizationId: number) =>
  useQuery({
    queryKey: ["renewal", "rental-organization", organizationId],
    queryFn: ({ signal }) => getRentalOrganization(organizationId, signal),
    enabled: Number.isSafeInteger(organizationId) && organizationId > 0,
    retry: false,
  });
export const useLockerLayout = (zoneId: string) =>
  useQuery({
    queryKey: lockerKeys.layout(zoneId),
    queryFn: ({ signal }) => getLockerLayout(zoneId, signal),
    enabled: isLockerId(zoneId),
    retry: false,
  });
export const useLockerRentalForm = (lockerId: string) =>
  useQuery({
    queryKey: lockerKeys.form(lockerId),
    queryFn: ({ signal }) => getLockerRentalForm(lockerId, signal),
    enabled: isLockerId(lockerId),
    retry: false,
  });
export const useLockerRentalStatus = (publicId: string, processed = false) =>
  useQuery({
    queryKey: lockerKeys.status(publicId),
    queryFn: ({ signal }) => getLockerRentalStatus(publicId, signal),
    enabled: Boolean(publicId.trim()) && !processed,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.status === "REQUESTED" ? 10_000 : false,
  });
export const useCreateLockerRental = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      lockerId,
      body,
    }: {
      lockerId: string;
      body: LockerRentalCreateRequest;
    }) => createLockerRental(lockerId, body),
    onSuccess: (data) => {
      client.setQueryData(lockerKeys.status(data.publicId), data);
      void client.invalidateQueries({
        queryKey: ["renewal", "lockers", "zones"],
      });
      void client.invalidateQueries({
        queryKey: ["renewal", "lockers", "layout"],
      });
    },
  });
};
export const useApproveLockerRental = (publicId: string) =>
  useMutation({
    gcTime: 0,
    mutationFn: (body: LockerManagerApproval) =>
      completeLockerApproval(publicId, body),
  });
