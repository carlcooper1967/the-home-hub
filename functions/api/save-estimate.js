export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { device_id, type, name, address, ...fields } = data;

    if (!device_id || !type || !name || !address) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const columns = Object.keys(fields);
    const values = Object.values(fields);
    const placeholders = columns.map(() => '?').join(',');
    const colList = columns.length > 0 ? ',' + columns.join(',') : '';
    const valList = values.length > 0 ? ',' + placeholders : '';

    await env.DB.prepare(
      `INSERT INTO estimates (device_id, type, name, address, created_at${colList}) VALUES (?, ?, ?, ?, datetime('now')${valList})`
    ).bind(device_id, type, name, address, ...values).run();

    // Auto-delete estimates older than 60 days
    await env.DB.prepare(
      `DELETE FROM estimates WHERE created_at < datetime('now', '-60 days')`
    ).run();

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
