import database from "../../../lib/db";
export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const limit = url.searchParams.get("limit") || 10;
  const agentid = url.searchParams.get("agentid");

  const pageNumber = parseInt(page, 10);
  const pageLimit = parseInt(limit, 10);
  const offset = (pageNumber - 1) * pageLimit;

  let query = "SELECT * FROM sales ORDER BY order_id LIMIT $1 OFFSET $2";
  const queryParams = [pageLimit, offset];

  if (agentid && agentid !== "All Agents" && agentid !== "Blank") {
    query =
      "SELECT * FROM sales WHERE agentid = $1 ORDER BY order_id LIMIT $2 OFFSET $3";
    queryParams.unshift(agentid);
  }

  try {
    const result = await database.query(query, queryParams);
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch sales data" }),
      { status: 500 }
    );
  }
}
