export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith("https://www.gofundme.com/f/")) {
    return res.status(400).json({ error: "Invalid or missing GoFundMe URL." });
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const html = await response.text();

    // Try to extract og:title first
    const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"\/?>/);
    if (ogTitleMatch && ogTitleMatch[1]) {
      return res.status(200).json({ title: ogTitleMatch[1] });
    }

    // Fallback: grab the <title> tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      return res.status(200).json({ title: titleMatch[1].trim() });
    }

    return res.status(404).json({ error: "Unable to extract campaign title." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch campaign page." });
  }
}
