import database from "../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password, name } = await req.json();

  try {
    const userCheck = await database.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userCheck.rowCount > 0) {
      return new Response(
        JSON.stringify({ message: "User already registered" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await database.query(
      "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *",
      [email, hashedPassword, name]
    );

    return new Response(
      JSON.stringify({ success: true, user: result.rows[0] }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
