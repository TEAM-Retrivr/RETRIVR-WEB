import { useSyncExternalStore } from "react";
import {
  INITIAL_PAYMENT_METHODS,
  INITIAL_PRIMARY_PAYMENT_METHOD_ID,
  type PaymentMethod,
} from "../types/paymentMethod";

type PaymentMethodsStoreSnapshot = {
  methods: PaymentMethod[];
  primaryId: string;
};

let methods: PaymentMethod[] = INITIAL_PAYMENT_METHODS;
let primaryId = INITIAL_PRIMARY_PAYMENT_METHOD_ID;
let snapshot: PaymentMethodsStoreSnapshot = { methods, primaryId };
const listeners = new Set<() => void>();

const emitChange = () => {
  snapshot = { methods, primaryId };
  listeners.forEach((listener) => listener());
};

const getSnapshot = () => snapshot;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const setPrimaryPaymentMethod = (methodId: string) => {
  if (!methods.some((method) => method.id === methodId)) return;
  if (primaryId === methodId) return;
  primaryId = methodId;
  emitChange();
};

export const addPaymentMethod = (method: PaymentMethod) => {
  if (methods.some((item) => item.id === method.id)) return;
  methods = [...methods, method];
  if (!primaryId) {
    primaryId = method.id;
  }
  emitChange();
};

export const removePaymentMethod = (methodId: string) => {
  const nextMethods = methods.filter((method) => method.id !== methodId);
  if (nextMethods.length === methods.length) return;

  methods = nextMethods;
  if (primaryId === methodId) {
    primaryId = nextMethods[0]?.id ?? "";
  }
  emitChange();
};

export const resetPaymentMethodsStore = () => {
  methods = [...INITIAL_PAYMENT_METHODS];
  primaryId = INITIAL_PRIMARY_PAYMENT_METHOD_ID;
  emitChange();
};

export const usePaymentMethodsStore = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
