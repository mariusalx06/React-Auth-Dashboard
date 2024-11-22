import database from "../../../lib/db";

export async function GET(request) {
  const url = new URL(request.url);
  const agentid = url.searchParams.get("agentid");
  const month = url.searchParams.get("month");
  const year = url.searchParams.get("year");
  const dateSort = url.searchParams.get("dateSort");
  const customerSatisfaction = url.searchParams.get("customerSatisfaction");
  const deviceCode = url.searchParams.get("deviceCode");
  const orderId = url.searchParams.get("orderId");

  let query = "SELECT * FROM sales WHERE 1=1";
  let conditions = [];
  let orderByClauses = [];

  if (orderId) {
    conditions.push(`order_id = '${orderId}'`);
  }

  if (agentid && agentid !== "All Agents" && agentid !== "Select") {
    conditions.push(`agentid = '${agentid}'`);
  }

  if (month && year) {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-${new Date(
      year,
      month,
      0
    ).getDate()}`;
    conditions.push(`date_of_renewal BETWEEN '${startDate}' AND '${endDate}'`);
  }

  if (deviceCode && deviceCode !== "Select") {
    conditions.push(`device_code = '${deviceCode}'`);
  }

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  if (dateSort && dateSort !== "Select") {
    orderByClauses.push(
      `date_of_renewal ${dateSort === "ascending" ? "ASC" : "DESC"}`
    );
  }

  if (customerSatisfaction && customerSatisfaction !== "Select") {
    orderByClauses.push(
      `customer_satisfaction ${
        customerSatisfaction === "Highest to Lowest" ? "DESC" : "ASC"
      }`
    );
  }

  if (orderByClauses.length === 0) {
    orderByClauses.push("order_id ASC");
  }

  if (orderByClauses.length > 0) {
    query += " ORDER BY " + orderByClauses.join(", ");
  }

  try {
    const result = await database.query(query);
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch sales data" }),
      { status: 500 }
    );
  }
}
