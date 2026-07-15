const axios = require('axios');
const cheerio = require('cheerio');

async function scrape() {
  try {
    const res = await axios.get('https://www.nalli.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const $ = cheerio.load(res.data);
    const title = $('title').text();
    console.log("Title:", title);
    // Find some image URLs
    const images = [];
    $('img').each((i, el) => {
      images.push($(el).attr('src'));
    });
    console.log("Found images:", images.slice(0, 5));
  } catch (err) {
    console.error("Error:", err.message);
  }
}
scrape();
