import axios from 'axios';

export const aiSearch = async (req, res) => {
  const { query, firecrawlKey } = req.body;
  try {
    const response = await axios.post('https://api.firecrawl.dev/v0/search', {
      query: query,
      pageOptions: { fetchPageContent: true },
      searchOptions: { limit: 5 }
    }, {
      headers: { 'Authorization': `Bearer ${firecrawlKey}`, 'Content-Type': 'application/json' }
    });

    const results = response.data.data.map((item, index) => ({
      ...item,
      matchScore: 99 - (index * 5), // Mock AI ranking
    }));

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ message: 'AI Search failed', error: error.message });
  }
};