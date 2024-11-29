import database from "../../../../lib/db";
import { getToken } from "next-auth/jwt";

export async function PUT(request, { params }) {
  try {
    const token = await getToken({ req: request });

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

    const { id } = await params;
    const {
      plan_name,
      plan_price,
      internet_data_limit_mb,
      voice_minutes_limit,
      sms_limit,
      internet_roaming_data_limit_mb,
    } = await request.json();

    const response = await database.query("SELECT * FROM plans WHERE id =$1", [
      id,
    ]);
    if (response.rows.length === 0) {
      return new Response(
        JSON.stringify({
          message: `Plan with id ${id} doesn't exist in the database`,
        }),
        { status: 404 }
      );
    }

    const query = `
        UPDATE plans 
        SET plan_name = $1, 
            plan_price = $2, 
            internet_data_limit_mb = $3, 
            voice_minutes_limit = $4, 
            sms_limit = $5, 
            internet_roaming_data_limit_mb = $6
        WHERE id = $7 
        RETURNING *;
      `;
    const values = [
      plan_name,
      plan_price,
      internet_data_limit_mb,
      voice_minutes_limit,
      sms_limit,
      internet_roaming_data_limit_mb,
      id,
    ];

    const result = await database.query(query, values);
    const modifiedPlan = result.rows[0];
    return new Response(JSON.stringify(modifiedPlan), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to modify plan" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = await getToken({ req: request });

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

    const { id } = await params;
    const response = await database.query("DELETE FROM plans WHERE id =$1", [
      id,
    ]);

    if (response.rowCount === 0) {
      return new Response(
        JSON.stringify({ error: `Plan with ID ${id} not found` }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: `Plan with ID ${id} successfully deleted` }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete plan" }),
      { status: 500 }
    );
  }
}
