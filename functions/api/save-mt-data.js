export async function onRequestPost({ request, env }) {
  try {
    const { pin, cloud_id, data } = await request.json();

    if (!pin || !cloud_id || !data) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const existing = await env.DB.prepare(
      `SELECT id FROM mt_data WHERE pin = ? LIMIT 1`
    ).bind(pin).first();

    if (existing) {
      await env.DB.prepare(
        `UPDATE mt_data SET cloud_id = ?, data = ?, updated_at = datetime('now') WHERE pin = ?`
      ).bind(cloud_id, data, pin).run();
    } else {
      await env.DB.prepare(
        `INSERT INTO mt_data (pin, cloud_id, data, updated_at) VALUES (?, ?, ?, datetime('now'))`
      ).bind(pin, cloud_id, data).run();
    }

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
