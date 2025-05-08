export default async function handler(req, res) {
  const originalUrl = req.query.url;

  if (!originalUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  const mobileUrl = originalUrl.replace("www.gofundme.com", "www.gofundme.com/m");

  try {
    const response = await fetch(mobileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
      },
    });

    const html = await response.text();
    console.log(html); // Keep this for troubleshooting

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
