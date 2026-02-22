import { useState, useCallback } from "react";
import { DynamicId, BADGES, DYNAMICS_LIST, type BadgeDef } from "@/data/dynamicsContent";

export interface DynamicSession {
  date: string; // ISO
  postScore: number;
  durationSeconds: number;
}

interface DynamicsData {
  sessions: Record<DynamicId, DynamicSession[]>;
  badges: string[];
}

const STORAGE_KEY = "dynamicsSessions";
const BADGES_KEY = "dynamicsBadges";

function loadData(): DynamicsData {
  const sessions: Record<DynamicId, DynamicSession[]> = {
    anchor: [],
    breathing: [],
    bodymap: [],
    release: [],
    inversion: [],
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      for (const key of Object.keys(sessions)) {
        if (parsed[key]) sessions[key as DynamicId] = parsed[key];
      }
    }
  } catch {}
  let badges: string[] = [];
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    if (raw) badges = JSON.parse(raw);
  } catch {}
  return { sessions, badges };
}

function saveData(data: DynamicsData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data.sessions));
  localStorage.setItem(BADGES_KEY, JSON.stringify(data.badges));
}

export function getStreak(allSessions: DynamicSession[]): number {
  if (!allSessions.length) return 0;
  const dates = [...new Set(allSessions.map((s) => s.date.slice(0, 10)))].sort().reverse();
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime();
    if (diff <= 86400000 * 1.5) streak++;
    else break;
  }
  // Check if streak includes today or yesterday
  const last = new Date(dates[0]).getTime();
  const now = Date.now();
  if (now - last > 86400000 * 1.5) return 0;
  return streak;
}

export function useDynamicsState() {
  const [data, setData] = useState<DynamicsData>(loadData);

  const addSession = useCallback(
    (dynamicId: DynamicId, postScore: number, durationSeconds: number) => {
      setData((prev) => {
        const session: DynamicSession = {
          date: new Date().toISOString(),
          postScore,
          durationSeconds,
        };
        const updated = {
          ...prev,
          sessions: {
            ...prev.sessions,
            [dynamicId]: [...prev.sessions[dynamicId], session],
          },
        };
        // Check for new badges
        const newBadges = [...prev.badges];
        const count = updated.sessions[dynamicId].length;

        BADGES.forEach((badge) => {
          if (newBadges.includes(badge.id)) return;
          if (badge.condition === "uses" && badge.dynamicId === dynamicId && count >= badge.threshold) {
            newBadges.push(badge.id);
          }
          if (badge.condition === "streak") {
            const allSessions = Object.values(updated.sessions).flat();
            if (getStreak(allSessions) >= badge.threshold) newBadges.push(badge.id);
          }
          if (badge.condition === "explorer") {
            const used = DYNAMICS_LIST.filter((d) => updated.sessions[d.id].length > 0).length;
            if (used >= badge.threshold) newBadges.push(badge.id);
          }
        });

        const final = { ...updated, badges: newBadges };
        saveData(final);
        return final;
      });
    },
    []
  );

  const getStats = useCallback(
    (dynamicId: DynamicId) => {
      const sessions = data.sessions[dynamicId];
      const total = sessions.length;
      const avgTime = total ? Math.round(sessions.reduce((s, x) => s + x.durationSeconds, 0) / total) : 0;
      const streak = getStreak(sessions);
      const last10 = sessions.slice(-10);
      const improving =
        last10.length >= 6 &&
        last10.slice(-3).reduce((s, x) => s + x.postScore, 0) / 3 >
          last10.slice(0, 3).reduce((s, x) => s + x.postScore, 0) / 3;
      return { total, avgTime, streak, improving, sessions: last10 };
    },
    [data]
  );

  const getNewBadges = useCallback(
    (dynamicId: DynamicId, prevBadgeCount: number): BadgeDef[] => {
      return BADGES.filter((b) => data.badges.includes(b.id)).slice(prevBadgeCount);
    },
    [data]
  );

  const getAllSessions = useCallback(() => {
    return Object.entries(data.sessions).flatMap(([id, sessions]) =>
      sessions.map((s) => ({ ...s, dynamicId: id as DynamicId }))
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data]);

  const getGlobalStreak = useCallback(() => {
    const allSessions = Object.values(data.sessions).flat();
    return getStreak(allSessions);
  }, [data]);

  return {
    data,
    addSession,
    getStats,
    getNewBadges,
    getAllSessions,
    getGlobalStreak,
    badges: data.badges,
  };
}
