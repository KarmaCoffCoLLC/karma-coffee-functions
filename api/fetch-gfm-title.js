// api/fetch-gfm-title.js

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url || !url.startsWith("https://www.gofundme.com/f/")) {
    return res.status(400).json({ error: "Invalid or missing GoFundMe URL." });
  }

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await response.text();

    const titleMatch = html.match(/"og:title"\s+content="([^"]+)"/i);
    if (titleMatch && titleMatch[1]) {
      const title = titleMatch[1];
      return res.status(200).json({ title });
    } else {
      return res.status(404).json({ error: "Unable to extract campaign title." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch campaign." });
  }
}
