export type PendingGuestLink = {
  guestRef?: string | null;
  sessionId?: string | null;
  email?: string | null;
  createdAt: number;
  version: 2;
};

const KEY_V2 = "icp_generator_pending_guest_link_v2";
const LEGACY_KEY_V1 = "pending_guest_link_v1";

function normalizeValue(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeEmail(value: unknown) {
  if (typeof value === "string") return value.trim() || null;
  if (value === null) return null;
  return undefined;
}

function toPendingGuestLink(raw: any): PendingGuestLink | null {
  if (!raw || typeof raw !== "object") return null;

  const guestRef = normalizeValue(raw.guestRef ?? raw.guest_ref);
  const sessionId = normalizeValue(raw.sessionId ?? raw.session_id);
  const email = normalizeEmail(raw.email);
  const createdAt =
    typeof raw.createdAt === "number"
      ? raw.createdAt
      : typeof raw.created_at === "number"
        ? raw.created_at
        : Date.now();

  if (!guestRef && !sessionId && email === undefined) return null;

  return {
    guestRef,
    sessionId,
    email,
    createdAt,
    version: 2,
  };
}

function writePendingGuestLink(payload: PendingGuestLink) {
  try {
    localStorage.setItem(KEY_V2, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

function migrateLegacyPendingLink() {
  try {
    const raw = localStorage.getItem(LEGACY_KEY_V1);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const migrated = toPendingGuestLink(parsed);
    if (migrated) {
      writePendingGuestLink(migrated);
    }
    localStorage.removeItem(LEGACY_KEY_V1);
    return migrated;
  } catch {
    return null;
  }
}

export function getPendingGuestLink(): PendingGuestLink | null {
  try {
    const raw = localStorage.getItem(KEY_V2);
    if (!raw) {
      return migrateLegacyPendingLink();
    }
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 2) {
      return migrateLegacyPendingLink();
    }
    return toPendingGuestLink(parsed);
  } catch {
    return null;
  }
}

export function setPendingGuestLink(payload: Partial<PendingGuestLink>) {
  const current = getPendingGuestLink();
  const guestRef =
    payload.guestRef !== undefined ? payload.guestRef : current?.guestRef ?? null;
  const sessionId =
    payload.sessionId !== undefined ? payload.sessionId : current?.sessionId ?? null;
  const email = payload.email !== undefined ? payload.email : current?.email ?? null;

  const next: PendingGuestLink = {
    guestRef,
    sessionId,
    email,
    createdAt: Date.now(),
    version: 2,
  };

  writePendingGuestLink(next);
}

export function clearPendingGuestLink() {
  try {
    localStorage.removeItem(KEY_V2);
    localStorage.removeItem(LEGACY_KEY_V1);
  } catch {
    // ignore
  }
}

export function getBestCheckoutIdentifiers(): {
  sessionId?: string;
  guestRef?: string;
} {
  const pending = getPendingGuestLink();
  const sessionId = normalizeValue(pending?.sessionId);
  const guestRef = normalizeValue(pending?.guestRef);

  if (sessionId) {
    return { sessionId, guestRef: guestRef ?? undefined };
  }
  if (guestRef) {
    return { guestRef };
  }
  return {};
}

export function buildLinkBody(): Record<string, string> {
  const { sessionId, guestRef } = getBestCheckoutIdentifiers();
  const body: Record<string, string> = {};
  if (sessionId) body.session_id = sessionId;
  if (guestRef) body.guest_ref = guestRef;
  return body;
}
