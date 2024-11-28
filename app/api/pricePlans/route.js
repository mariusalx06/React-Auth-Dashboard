import { getToken } from "next-auth/jwt";
import database from "../../../lib/db";

export async function GET() {
  try {
    const response = await database.query(
      "SELECT * FROM plans ORDER BY plan_price ASC"
    );
    const plans = response.rows;

    return new Response(JSON.stringify(plans), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch plans data" }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = await getToken({ req: request });
    console.log(token);

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized access: No authentication" }),
        { status: 401 }
      );
    }

    if (token.role !== "manager") {
      return new Response(
        JSON.stringify({
          error: "Unauthorized access: You do not have permission",
        }),
        { status: 403 }
      );
    }

    const {
      plan_name,
      plan_price,
      internet_data_limit_mb,
      voice_minutes_limit,
      sms_limit,
      internet_roaming_data_limit_mb,
    } = await request.json();

    const lastPlanResponse = await database.query(
      "SELECT plan_id FROM plans ORDER BY plan_id DESC LIMIT 1"
    );
    let lastPlanId = lastPlanResponse.rows[0]?.plan_id || "P0";
    let lastNumber = parseInt(lastPlanId.slice(1), 10);
    const newPlanId = `P${lastNumber + 1}`;

    const query = `
        INSERT INTO plans (plan_id, plan_name, plan_price, internet_data_limit_mb, voice_minutes_limit, sms_limit, internet_roaming_data_limit_mb)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
      `;
    const values = [
      newPlanId,
      plan_name,
      plan_price,
      internet_data_limit_mb,
      voice_minutes_limit,
      sms_limit,
      internet_roaming_data_limit_mb,
    ];

    const response = await database.query(query, values);
    const newPlan = response.rows[0];

    return new Response(JSON.stringify(newPlan), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create plan" }),
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const query = "DELETE FROM plans RETURNING *;";

    const response = await database.query(query);

    if (response.rowCount === 0) {
      return new Response(
        JSON.stringify({ message: "No plans found to delete" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "All plans have been deleted" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete plans" }), {
      status: 500,
    });
  }
}
