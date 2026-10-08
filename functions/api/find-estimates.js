export async function onRequestPost({ request, env }) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const result = await env.DB.prepare(
      `SELECT * FROM estimates WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 50`
    ).bind(email, type).all();

    return Response.json({ success: true, estimates: result.results });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
