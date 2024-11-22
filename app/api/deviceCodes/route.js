import database from "../../../lib/db";

export async function GET() {
  try {
    const result = await database.query("SELECT device_code FROM devices");

    const deviceCodes = result.rows.map((row) => row.device_code);

    return new Response(JSON.stringify(deviceCodes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching device codes:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch device codes" }),
      {
        status: 500,
      }
    );
  }
}
