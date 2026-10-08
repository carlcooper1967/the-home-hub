export async function onRequestPost({ request, env }) {
  try {
    const { tags, note } = await request.json();

    if (!tags || !tags.length) {
      return Response.json({ success: false, error: "Missing tags" }, { status: 400 });
    }

    if (!env.GEMINI_API_KEY) {
      return Response.json({ success: false, error: "AI drafting is not configured yet" }, { status: 500 });
    }

    const prompt =
      "Write a short, genuine-sounding real estate client review (2 to 4 sentences, first person) " +
      "for a real estate agent named Carl Cooper, based on these highlights the client picked: " +
      tags.join(", ") +
      (note ? (". Additional note from the client: " + note) : "") +
      ". Keep it natural, specific, and varied in phrasing, not generic or templated sounding. " +
      "Do not use quotation marks around the review. Do not sign it or add a name at the end.";

    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9 }
        })
      }
    );

    const data = await r.json();
    const text =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    if (!text) {
      return Response.json({ success: false, error: "No draft returned" }, { status: 500 });
    }

    return Response.json({ success: true, text: text.trim() });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
