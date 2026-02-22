import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Activity, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface KPI {
  totalUsers: number;
  activeUsers7d: number;
  totalChaptersRead: number;
  totalDynamics: number;
}

interface RecentUser {
  user_id: string;
  email: string;
  name: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [kpi, setKpi] = useState<KPI>({ totalUsers: 0, activeUsers7d: 0, totalChaptersRead: 0, totalDynamics: 0 });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [signupChart, setSignupChart] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Total users
      const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });

      // Active users (7d) - users with page_views in last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const { data: activeData } = await supabase
        .from("page_views")
        .select("user_id")
        .gte("viewed_at", sevenDaysAgo);
      const uniqueActive = new Set(activeData?.map((r) => r.user_id)).size;

      // Total chapters read
      const { count: totalChaptersRead } = await supabase.from("reading_progress").select("*", { count: "exact", head: true });

      // Total dynamics
      const { count: totalDynamics } = await supabase.from("dynamics_usage").select("*", { count: "exact", head: true });

      setKpi({
        totalUsers: totalUsers || 0,
        activeUsers7d: uniqueActive,
        totalChaptersRead: totalChaptersRead || 0,
        totalDynamics: totalDynamics || 0,
      });

      // Recent users
      const { data: recent } = await supabase
        .from("profiles")
        .select("user_id, email, name, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      setRecentUsers((recent as RecentUser[]) || []);

      // Signup chart (last 14 days)
      const { data: allProfiles } = await supabase.from("profiles").select("created_at");
      const chartMap: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        chartMap[d.toISOString().slice(0, 10)] = 0;
      }
      allProfiles?.forEach((p) => {
        const day = p.created_at?.slice(0, 10);
        if (day && chartMap[day] !== undefined) chartMap[day]++;
      });
      setSignupChart(Object.entries(chartMap).map(([date, count]) => ({ date: date.slice(5), count })));

      setLoading(false);
    };
    fetchData();
  }, []);

  const kpis = [
    { label: "Total Usuários", value: kpi.totalUsers, icon: Users, color: "text-blue-600" },
    { label: "Ativos (7d)", value: kpi.activeUsers7d, icon: Eye, color: "text-green-600" },
    { label: "Capítulos Lidos", value: kpi.totalChaptersRead, icon: BookOpen, color: "text-amber-600" },
    { label: "Dinâmicas Feitas", value: kpi.totalDynamics, icon: Activity, color: "text-purple-600" },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">Visão geral da plataforma CorpoFala</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon size={18} className={color} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Signup Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Cadastros por dia (últimos 14 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={signupChart}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos cadastros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Nome</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.user_id} className="border-b border-border/50">
                    <td className="py-2.5 text-foreground">{u.name || "—"}</td>
                    <td className="py-2.5 text-muted-foreground">{u.email}</td>
                    <td className="py-2.5 text-muted-foreground">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr><td colSpan={3} className="py-4 text-center text-muted-foreground">Nenhum usuário ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
