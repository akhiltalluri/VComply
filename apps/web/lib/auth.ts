"use client";

import { useEffect, useState } from "react";
import type { AuthSession, AuthUser } from "@/types";
import { parseStoredJson } from "@/lib/storage";

const SESSION_KEY = "session";
const USER_KEY = "user";
const AUTH_EVENT = "vcomply-auth-changed";

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const session = parseStoredJson<AuthSession>(window.localStorage.getItem(SESSION_KEY));
  if (!session?.access_token) {
    return null;
  }

  return session;
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseStoredJson<AuthUser>(window.localStorage.getItem(USER_KEY));
}

export function getAuthSnapshot() {
  const session = getStoredSession();
  const user = getStoredUser();

  return {
    session,
    user,
    authenticated: Boolean(session),
  };
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredSession());
}

export function storeAuthState(session: AuthSession | null, user: AuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearAuthState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function subscribeToAuthState(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === SESSION_KEY || event.key === USER_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

export function useAuthState() {
  const [state, setState] = useState(() => ({
    authenticated: false,
    ready: false,
    user: null as AuthUser | null,
    session: null as AuthSession | null,
  }));

  useEffect(() => {
    const syncAuthState = () => {
      const snapshot = getAuthSnapshot();
      setState({
        authenticated: snapshot.authenticated,
        ready: true,
        user: snapshot.user,
        session: snapshot.session,
      });
    };

    syncAuthState();
    return subscribeToAuthState(syncAuthState);
  }, []);

  return state;
}
