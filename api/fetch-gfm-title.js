export default async function handler(req, res) {
  const originalUrl = req.query.url;

  if (!originalUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    const response = await fetch(originalUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        "Accept": "text/html",
      },
    });

    const html = await response.text();

    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    console.log("Fetched the title match" + titleMatch);
    const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/i);

    const title = titleMatch ? titleMatch[1].replace(" | GoFundMe", "").trim() : null;
    console.log("Fetched the title" + title);
    const image = ogImageMatch ? ogImageMatch[1] : null;

    if (!title) {
      return res.status(200).json({ error: "Unable to extract campaign title." });
    }

    return res.status(200).json({ title, image });
  } catch (err) {
    return res.status(500).json({ error: "Internal error: " + err.message });
  }
}
