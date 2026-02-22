import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AccessStatus = "pending" | "active" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  accessStatus: AccessStatus;
  accessLoading: boolean;
  refreshAccess: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  adminLoading: true,
  accessStatus: null,
  accessLoading: true,
  refreshAccess: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [accessStatus, setAccessStatus] = useState<AccessStatus>(null);
  const [accessLoading, setAccessLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check admin role whenever user changes
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    setAdminLoading(true);
    const checkAdmin = async () => {
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/check-admin`,
          {
            headers: {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setIsAdmin(data.isAdmin === true);
      } catch {
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };
    checkAdmin();
  }, [user]);

  // Check access status whenever user changes
  const fetchAccess = async () => {
    if (!user) {
      setAccessStatus(null);
      setAccessLoading(false);
      return;
    }
    setAccessLoading(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("access_status")
        .eq("user_id", user.id)
        .single();
      setAccessStatus((data?.access_status as AccessStatus) ?? "pending");
    } catch {
      setAccessStatus("pending");
    } finally {
      setAccessLoading(false);
    }
  };

  useEffect(() => {
    fetchAccess();
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setAccessStatus(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, adminLoading, accessStatus, accessLoading, refreshAccess: fetchAccess, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
