export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes('gofundme.com')) {
    return res.status(400).json({ error: 'Invalid GoFundMe URL.' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Try og:title first
    const ogTitleMatch = html.match(/<meta property="og:title" content="(.*?)"/i);
    if (ogTitleMatch && ogTitleMatch[1]) {
      return res.status(200).json({ title: ogTitleMatch[1] });
    }

    // Fallback to <title>
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      return res.status(200).json({ title: titleMatch[1].replace(" | GoFundMe", "").trim() });
    }

    return res.status(404).json({ error: 'Unable to extract campaign title.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error while fetching campaign.' });
  }
}
