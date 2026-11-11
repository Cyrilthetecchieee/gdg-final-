import fs from "node:fs";
import path from "node:path";

export interface DFSParticipant {
  id: string;
  position: number; // 1 to 5
  name: string;
  role?: string;
  institution?: string;
}

export interface DFSDraft {
  participants: DFSParticipant[];
  updatedAt: string | null;
  updatedBy?: string;
}

export interface DFSPublished {
  isPublished: boolean;
  publishedAt: string | null;
  publishedBy?: string;
  participants: DFSParticipant[];
  version: number;
}

export interface DFSStoreData {
  draft: DFSDraft;
  published: DFSPublished;
}

const DEFAULT_STORE_DATA: DFSStoreData = {
  draft: {
    participants: [
      { id: "dfs-pos-1", position: 1, name: "", role: "", institution: "" },
      { id: "dfs-pos-2", position: 2, name: "", role: "", institution: "" },
      { id: "dfs-pos-3", position: 3, name: "", role: "", institution: "" },
      { id: "dfs-pos-4", position: 4, name: "", role: "", institution: "" },
      { id: "dfs-pos-5", position: 5, name: "", role: "", institution: "" },
    ],
    updatedAt: null,
    updatedBy: undefined,
  },
  published: {
    isPublished: false,
    publishedAt: null,
    publishedBy: undefined,
    participants: [],
    version: 0,
  },
};

let memoryStore: DFSStoreData = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA)) as DFSStoreData;

function getStorageFilePath(): string {
  const primary = path.join(process.cwd(), "data", "dfs-participants.json");
  try {
    const dir = path.dirname(primary);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return primary;
  } catch {
    return path.join("/tmp", "dfs-participants.json");
  }
}

async function fetchSupabase(endpoint: string, options: RequestInit = {}): Promise<unknown> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const res = await fetch(`${url}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Database error: ${res.statusText}`);
  }

  return res.json();
}

export async function getDFSStoreData(): Promise<DFSStoreData> {
  if (process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)) {
    try {
      const rows = await fetchSupabase("dfs_participant_announcements?id=eq.dfs_2026&select=*");
      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0] as { draft_data?: unknown; published_data?: unknown };
        const draft = typeof row.draft_data === "string" ? (JSON.parse(row.draft_data) as DFSDraft) : (row.draft_data as DFSDraft);
        const published =
          typeof row.published_data === "string"
            ? (JSON.parse(row.published_data) as DFSPublished)
            : (row.published_data as DFSPublished);
        const data: DFSStoreData = {
          draft: draft || DEFAULT_STORE_DATA.draft,
          published: published || DEFAULT_STORE_DATA.published,
        };
        memoryStore = JSON.parse(JSON.stringify(data)) as DFSStoreData;
        return data;
      }
    } catch {
      // Fall back to local file storage
    }
  }

  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content) as DFSStoreData;
      if (parsed?.draft && parsed?.published) {
        memoryStore = parsed;
        return memoryStore;
      }
    }
  } catch {
    // Read fallback
  }

  return memoryStore;
}

async function persistStoreData(data: DFSStoreData): Promise<void> {
  memoryStore = JSON.parse(JSON.stringify(data)) as DFSStoreData;

  if (process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)) {
    try {
      await fetchSupabase("dfs_participant_announcements", {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify({
          id: "dfs_2026",
          draft_data: data.draft,
          published_data: data.published,
          is_published: data.published.isPublished,
          published_at: data.published.publishedAt,
          updated_at: new Date().toISOString(),
        }),
      });
    } catch {
      // Ignore remote sync error when local persistence succeeds
    }
  }

  try {
    const filePath = getStorageFilePath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Read-only FS fallback remains in memoryStore
  }
}

export async function getPublicDFSData(): Promise<{
  isPublished: boolean;
  publishedAt: string | null;
  participants: DFSParticipant[];
  version: number;
}> {
  const store = await getDFSStoreData();
  if (!store.published.isPublished) {
    return {
      isPublished: false,
      publishedAt: null,
      participants: [],
      version: store.published.version || 0,
    };
  }

  return {
    isPublished: true,
    publishedAt: store.published.publishedAt,
    participants: store.published.participants.map((p) => ({
      id: p.id,
      position: p.position,
      name: p.name,
      ...(p.role ? { role: p.role } : {}),
      ...(p.institution ? { institution: p.institution } : {}),
    })),
    version: store.published.version,
  };
}

export async function saveDFSDraft(
  rawParticipants: Partial<DFSParticipant>[],
  adminId = "admin",
): Promise<DFSDraft> {
  const current = await getDFSStoreData();

  const normalized: DFSParticipant[] = [];
  for (let i = 1; i <= 5; i++) {
    const incoming = rawParticipants.find((p) => p.position === i) || rawParticipants[i - 1];
    normalized.push({
      id: incoming?.id || `dfs-pos-${i}`,
      position: i,
      name: (incoming?.name || "").trim().slice(0, 100),
      role: (incoming?.role || "").trim().slice(0, 100),
      institution: (incoming?.institution || "").trim().slice(0, 150),
    });
  }

  current.draft = {
    participants: normalized,
    updatedAt: new Date().toISOString(),
    updatedBy: adminId,
  };

  await persistStoreData(current);
  return current.draft;
}

export interface PublishValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateParticipantsForPublish(participants: DFSParticipant[]): PublishValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(participants) || participants.length !== 5) {
    errors.push("Exactly 5 participant positions are required.");
    return { valid: false, errors };
  }

  const seenNames = new Set<string>();

  participants.forEach((p, index) => {
    const pos = p.position || index + 1;
    const trimmed = (p.name || "").trim();

    if (!trimmed) {
      errors.push(`Position ${String(pos).padStart(2, "0")}: Full name is required.`);
      return;
    }

    if (trimmed.length > 100) {
      errors.push(`Position ${String(pos).padStart(2, "0")}: Name cannot exceed 100 characters.`);
    }

    const lower = trimmed.toLowerCase();
    if (seenNames.has(lower)) {
      errors.push(`Position ${String(pos).padStart(2, "0")}: Duplicate name "${trimmed}" detected.`);
    }
    seenNames.add(lower);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function publishDFSSelection(adminId = "admin"): Promise<DFSPublished> {
  const current = await getDFSStoreData();
  const validation = validateParticipantsForPublish(current.draft.participants);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const snapshot: DFSParticipant[] = current.draft.participants.map((p) => ({
    id: p.id,
    position: p.position,
    name: p.name.trim(),
    role: p.role?.trim() || undefined,
    institution: p.institution?.trim() || undefined,
  }));

  current.published = {
    isPublished: true,
    publishedAt: new Date().toISOString(),
    publishedBy: adminId,
    participants: snapshot,
    version: (current.published.version || 0) + 1,
  };

  await persistStoreData(current);
  return current.published;
}

export async function unpublishDFSSelection(adminId = "admin"): Promise<DFSPublished> {
  const current = await getDFSStoreData();

  current.published = {
    isPublished: false,
    publishedAt: current.published.publishedAt,
    publishedBy: adminId,
    participants: [],
    version: (current.published.version || 0) + 1,
  };

  await persistStoreData(current);
  return current.published;
}
