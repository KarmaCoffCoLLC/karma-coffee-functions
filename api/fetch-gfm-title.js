export default async function handler(req, res) {
  const originalUrl = req.query.url;

  if (!originalUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  const mobileUrl = originalUrl.replace("www.gofundme.com", "www.gofundme.com/m");

  try {
    const response = await fetch(mobileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
      }
    });

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
