export async function onRequestPost({ request, env }) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return Response.json({ success: false, error: "Missing PIN" }, { status: 400 });
    }

    const result = await env.DB.prepare(
      `SELECT data, cloud_id FROM mt_data WHERE pin = ? LIMIT 1`
    ).bind(pin).first();

    if (!result) {
      return Response.json({ success: false, error: "No data found" });
    }

    return Response.json({ success: true, data: result.data, cloud_id: result.cloud_id });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
