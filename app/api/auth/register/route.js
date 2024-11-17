import database from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { email, password, name } = await req.json();

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // Insert the new user into the database
    const result = await database.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, name]
    );

    // Return success response
    return new Response(
      JSON.stringify({ success: true, user: result.rows[0] }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error inserting user', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}