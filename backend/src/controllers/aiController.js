import axios from 'axios';

// 1. Retry with backoff logic
const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    // Only retry on rate limits (429) or server errors (5xx)
    if (retries === 0 || (status !== 429 && status < 500)) {
      throw error;
    }
    console.log(`⚠️ Error ${status}. Retrying in ${delay}ms... (${retries} attempts left)`);
    await new Promise(res => setTimeout(res, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
};

export const aiSearch = async (req, res) => {
  const { query, firecrawlKey } = req.body;

  if (!firecrawlKey) {
    return res.status(400).json({ message: 'Firecrawl API Key is required for AI Search.' });
  }

  try {
    // 2. Search to Scrape via Firecrawl
    const firecrawlData = await fetchWithRetry(
      'https://api.firecrawl.dev/v1/search',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firecrawlKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          query: query,
          limit: 5,
          scrapeOptions: { formats: ['markdown'] }
        }
      }
    );

    if (!firecrawlData.success || !firecrawlData.data) {
      return res.status(400).json({ message: 'Failed to get results from Firecrawl.' });
    }

    // 3. Deduplicate and Filter (Remove Rentals)
    const seenUrls = new Set();
    const filteredResults = firecrawlData.data.filter(item => {
      // Deduplicate by URL
      if (seenUrls.has(item.url)) return false;
      seenUrls.add(item.url);

      // Filter out rentals
      const text = (item.title + ' ' + (item.description || '')).toLowerCase();
      if (text.includes('rent') || text.includes('lease') || text.includes('pg')) {
        return false;
      }

      return true;
    });

    // 4. Rank results (Mock AI ranking based on keyword match)
    const rankedResults = filteredResults.map((item, index) => {
      // Simple heuristic ranking: exact matches in title score higher
      const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
      const score = titleMatch ? 98 - (index * 2) : 85 - (index * 3);
      
      return {
        id: item.url, // Use URL as the ID for scraping results
        title: item.title,
        description: item.description || 'No description available.',
        url: item.url,
        matchScore: score,
        source: 'Web Scraped',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800' // Fallback image
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, data: rankedResults });

  } catch (error) {
    console.error("AI Search Error:", error.message);
    res.status(500).json({ message: 'AI Search failed.', error: error.message });
  }
};