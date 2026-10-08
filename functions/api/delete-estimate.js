export async function onRequestPost({ request, env }) {
  try {
    const { device_id, id, email } = await request.json();

    if (!id || (!device_id && !email)) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (email) {
      await env.DB.prepare(
        `DELETE FROM estimates WHERE id = ? AND (device_id = ? OR email = ?)`
      ).bind(id, device_id || "", email).run();
    } else {
      await env.DB.prepare(
        `DELETE FROM estimates WHERE id = ? AND device_id = ?`
      ).bind(id, device_id).run();
    }

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
