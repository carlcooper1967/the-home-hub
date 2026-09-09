export async function onRequestPost({ request, env }) {
  try {
    const { device_id, type } = await request.json();

    if (!device_id || !type) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const result = await env.DB.prepare(
      `SELECT * FROM estimates WHERE device_id = ? AND type = ? ORDER BY created_at DESC LIMIT 50`
    ).bind(device_id, type).all();

    return Response.json({ success: true, estimates: result.results });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
