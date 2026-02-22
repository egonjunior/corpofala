import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#C4622D", "#2563eb", "#16a34a", "#9333ea", "#ea580c", "#0891b2"];

const AdminMetrics = () => {
  const [pageData, setPageData] = useState<{ page: string; views: number }[]>([]);
  const [dynamicData, setDynamicData] = useState<{ type: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // Top pages
      const { data: pages } = await supabase.from("page_views").select("page_path");
      const pageMap: Record<string, number> = {};
      pages?.forEach((p) => {
        pageMap[p.page_path] = (pageMap[p.page_path] || 0) + 1;
      });
      const sorted = Object.entries(pageMap)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
      setPageData(sorted);

      // Dynamics usage
      const { data: dynamics } = await supabase.from("dynamics_usage").select("dynamic_type");
      const dynMap: Record<string, number> = {};
      dynamics?.forEach((d) => {
        dynMap[d.dynamic_type] = (dynMap[d.dynamic_type] || 0) + 1;
      });
      setDynamicData(Object.entries(dynMap).map(([type, count]) => ({ type, count })));

      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando métricas...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Métricas</h1>
      <p className="text-sm text-muted-foreground mb-8">Detalhamento de uso da plataforma</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Páginas mais acessadas</CardTitle>
          </CardHeader>
          <CardContent>
            {pageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={pageData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="page" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">Sem dados ainda.</p>
            )}
          </CardContent>
        </Card>

        {/* Dynamics Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Uso das dinâmicas</CardTitle>
          </CardHeader>
          <CardContent>
            {dynamicData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={dynamicData} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={100} label>
                    {dynamicData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">Sem dados ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMetrics;
