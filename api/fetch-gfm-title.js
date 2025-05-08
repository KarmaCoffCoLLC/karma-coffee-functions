export default async function handler(req, res) {
  const originalUrl = req.query.url;

  if (!originalUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  const mobileUrl = originalUrl.replace("www.gofundme.com", "www.gofundme.com/m");

  try {
    const response = await fetch(mobileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.212 Safari/537.36"
      }
    });

    const html = await response.text();

    console.log("HTML Response:", html.slice(0, 1000)); // Show first 1000 chars

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
