export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const originalUrl = req.query.url;

  if (!originalUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  const response = await fetch(originalUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://www.gofundme.com/",
    },
  });


    const html = await response.text();

    // Try to get the real visible title from GoFundMe's h1 tag
    const h1TitleMatch = html.match(/<h1[^>]*class="[^"]*p-campaign-title[^"]*"[^>]*>(.*?)<\/h1>/i);
    const fallbackTitleMatch = html.match(/<title>(.*?)<\/title>/i);
    const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/i);

    const title = h1TitleMatch
      ? decodeEntities(h1TitleMatch[1].trim())
      : fallbackTitleMatch
      ? fallbackTitleMatch[1].replace(" | GoFundMe", "").trim()
      : null;

    const image = ogImageMatch ? ogImageMatch[1] : null;

    if (!title) {
      return res.status(200).json({ error: "Unable to extract campaign title." });
    }

    return res.status(200).json({ title, image });
  } catch (err) {
    console.error("Error fetching GoFundMe:", err);
    return res.status(500).json({ error: "Internal error: " + err.message });
  }
}

// HTML entity decoder (handles things like &amp;)
function decodeEntities(str) {
  return str.replace(/&#?(\w+);/g, (_, entity) => {
    const entities = {
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"',
      apos: "'",
    };
    return entities[entity] || _;
  });
}
