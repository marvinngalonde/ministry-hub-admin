import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function DebugDatabase() {
  const { data: debugInfo, isLoading } = useQuery({
    queryKey: ['debug-database'],
    queryFn: async () => {
      console.log('🔍 Starting database debug...');
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

      const results: any = {};

      // Test sermons
      const sermonsQuery = supabase.from('sermons').select('*', { count: 'exact' });
      const sermonsResult = await sermonsQuery;
      console.log('📖 Sermons raw result:', sermonsResult);
      results.sermons = {
        data: sermonsResult.data,
        error: sermonsResult.error,
        count: sermonsResult.count,
        status: sermonsResult.status,
        statusText: sermonsResult.statusText,
      };

      // Test documentaries
      const docsResult = await supabase.from('documentaries').select('*', { count: 'exact' });
      console.log('🎬 Documentaries raw result:', docsResult);
      results.documentaries = {
        data: docsResult.data,
        error: docsResult.error,
        count: docsResult.count,
      };

      // Test presentations
      const presResult = await supabase.from('presentations').select('*', { count: 'exact' });
      console.log('📺 Presentations raw result:', presResult);
      results.presentations = {
        data: presResult.data,
        error: presResult.error,
        count: presResult.count,
      };

      // Test materials
      const matsResult = await supabase.from('spiritual_materials').select('*', { count: 'exact' });
      console.log('📚 Materials raw result:', matsResult);
      results.materials = {
        data: matsResult.data,
        error: matsResult.error,
        count: matsResult.count,
      };

      // Test posts
      const postsResult = await supabase.from('community_posts').select('*', { count: 'exact' });
      console.log('💬 Posts raw result:', postsResult);
      results.posts = {
        data: postsResult.data,
        error: postsResult.error,
        count: postsResult.count,
      };

      // Test users
      const usersResult = await supabase.from('user_profiles').select('*', { count: 'exact' });
      console.log('👥 Users raw result:', usersResult);
      results.users = {
        data: usersResult.data,
        error: usersResult.error,
        count: usersResult.count,
      };

      return results;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Database Debug</h1>
        <p className="text-muted-foreground">Direct database query results</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded text-xs overflow-auto">
            {JSON.stringify({
              supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
              hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
            }, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {debugInfo && Object.entries(debugInfo).map(([table, result]: [string, any]) => (
        <Card key={table}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{table}</span>
              <span className="text-sm font-normal">
                {result.error ? (
                  <span className="text-destructive">ERROR</span>
                ) : (
                  <span className="text-green-600">Count: {result.count}</span>
                )}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.error && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded">
                <p className="font-semibold text-destructive">Error:</p>
                <pre className="text-xs mt-2 overflow-auto">
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              </div>
            )}
            <div>
              <p className="font-semibold mb-2">Data ({result.data?.length || 0} items):</p>
              <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
