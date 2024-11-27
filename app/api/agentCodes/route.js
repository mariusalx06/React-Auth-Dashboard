import database from "../../../lib/db";

export async function GET() {
  try {
    const result = await database.query(
      "SELECT agent_id FROM agents WHERE agent_id IS NOT NULL"
    );

    const agents = result.rows.map((row) => row.agentid);

    return new Response(JSON.stringify(agents), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch agents" }), {
      status: 500,
    });
  }
}
