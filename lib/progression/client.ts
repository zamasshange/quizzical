"use client";

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  applyProgressionEvent,
  getDefaultProgressionState,
  loadRawState,
} from "./engine";
import { buildFullProgressionState } from "./buildState";
import type {
  ProgressionEventPayload,
  ProgressionEventResult,
  ProgressionState,
} from "./types";
import { detectCountryCode } from "./countries";

type ProgressionListener = (result: ProgressionEventResult) => void;
const listeners = new Set<ProgressionListener>();

export function onProgressionEvent(fn: ProgressionListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(result: ProgressionEventResult) {
  listeners.forEach((fn) => fn(result));
}

export function useProgression() {
  const { isSignedIn } = useUser();
  const [state, setState] = useState<ProgressionState>(() =>
    getDefaultProgressionState(detectCountryCode()),
  );
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (isSignedIn) {
      try {
        const res = await fetch("/api/progression");
        if (res.ok) {
          const data = (await res.json()) as ProgressionState;
          setState(data);
          setLoaded(true);
          return;
        }
      } catch {
        /* fall through */
      }
    }
    setState(buildFullProgressionState(loadRawState()));
    setLoaded(true);
  }, [isSignedIn]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const recordEvent = useCallback(
    async (payload: ProgressionEventPayload): Promise<ProgressionEventResult> => {
      if (isSignedIn) {
        try {
          const res = await fetch("/api/progression/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const result = (await res.json()) as ProgressionEventResult;
            setState(result.state);
            emit(result);
            return result;
          }
        } catch {
          /* fall through */
        }
      }

      const raw = loadRawState();
      const result = applyProgressionEvent(raw, payload);
      setState(result.state);
      emit(result);
      return result;
    },
    [isSignedIn],
  );

  const setCountryCode = useCallback((countryCode: string) => {
    setState((prev) => ({ ...prev, countryCode }));
  }, []);

  return { state, loaded, refresh, recordEvent, setCountryCode };
}

export async function recordProgressionEvent(
  payload: ProgressionEventPayload,
): Promise<ProgressionEventResult> {
  const isSignedIn =
    typeof window !== "undefined" &&
    document.cookie.includes("__session");

  if (isSignedIn) {
    try {
      const res = await fetch("/api/progression/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const result = (await res.json()) as ProgressionEventResult;
        emit(result);
        return result;
      }
    } catch {
      /* local fallback */
    }
  }

  const raw = loadRawState();
  const result = applyProgressionEvent(raw, payload);
  emit(result);
  return result;
}
