export async function onRequestPost({ request, env }) {
  try {
    const { device_id, id } = await request.json();

    if (!device_id || !id) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await env.DB.prepare(
      `DELETE FROM estimates WHERE id = ? AND device_id = ?`
    ).bind(id, device_id).run();

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
