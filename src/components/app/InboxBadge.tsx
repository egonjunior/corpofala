import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const InboxBadge = ({ className = "" }: { className?: string }) => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ count: totalCount }, { data: reads }] = await Promise.all([
        supabase
          .from("messages")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("message_reads")
          .select("message_id")
          .eq("user_id", user.id),
      ]);
      const readCount = reads?.length || 0;
      const total = totalCount || 0;
      setCount(Math.max(0, total - readCount));
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [user]);

  if (count === 0) return null;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-white font-bold ${className}`}
      style={{
        background: "#C4622D",
        fontSize: 9,
        minWidth: 16,
        height: 16,
        padding: "0 4px",
        lineHeight: 1,
      }}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
};

export default InboxBadge;
