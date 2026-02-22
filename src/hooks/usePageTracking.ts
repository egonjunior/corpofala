import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Debounced page-view tracker.
 * - Skips duplicate consecutive paths
 * - 2s debounce to avoid rapid-fire inserts on fast navigation
 * - Batches are fire-and-forget (no blocking)
 */
export const usePageTracking = () => {
  const location = useLocation();
  const { user } = useAuth();
  const lastPath = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;

    const path = location.pathname;

    // Skip duplicate consecutive paths
    if (path === lastPath.current) return;

    // Clear pending debounce
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      lastPath.current = path;
      supabase
        .from("page_views")
        .insert({ user_id: user.id, page_path: path })
        .then(() => {});
    }, 2000);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [location.pathname, user]);
};
