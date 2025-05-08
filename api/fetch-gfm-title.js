export default async function handler(req, res) {
  const originalUrl = req.query.url;

  if (!originalUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  const apiKey = process.env.SCRAPER_API_KEY; // Add this in Vercel env vars
  const targetUrl = encodeURIComponent(originalUrl);
  const proxyUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${targetUrl}`;

  try {
    const response = await fetch(proxyUrl);
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
