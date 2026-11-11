import { NextRequest, NextResponse } from "next/server";
import { getRequestCookie, hasSession } from "@/libs/session";
import { serverEnv } from "@/libs/env/server";

/**
 * CSV export proxy. Route handlers are not wrapped by the `(admin)` layout, so
 * the session cookie is checked here and forwarded — the backend's
 * `AdminReadAuthGuard` authorizes it exactly like the table reads. The query
 * string passes through untouched so the export honours the same filters.
 */
export async function GET(request: NextRequest) {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookie = await getRequestCookie();
  const upstream = await fetch(
    `${serverEnv.backendUrl}${serverEnv.apiPrefix}/admin/transactions/export${request.nextUrl.search}`,
    {
      headers: cookie ? { cookie } : {},
      cache: "no-store",
    },
  );

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Export failed" }, { status: upstream.status || 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="transactions.csv"',
      "cache-control": "no-store",
    },
  });
}
