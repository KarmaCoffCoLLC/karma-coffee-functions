export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
const response = await fetch(url.replace("www.gofundme.com", "www.gofundme.com/m"));
    const html = await response.text();

    const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/i);
    const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/i);

    const title = titleMatch ? titleMatch[1] : null;
    const image = imageMatch ? imageMatch[1] : null;

    if (!title) {
      return res.status(200).json({ error: "Unable to extract campaign title." });
    }

    return res.status(200).json({ title, image });
  } catch (err) {
    return res.status(500).json({ error: "Internal error: " + err.message });
  }
}
