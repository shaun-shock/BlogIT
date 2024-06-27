import fetch from "node-fetch";



const NEWS_API_KEY = '17d96467c4264e9db22fe712b48429d1'; 
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;

async function fetchNews() {
  try {
    const response = await fetch(NEWS_API_URL);
    const data = await response.json();

    if (data.status === 'ok') {
      const titles = [];
      const contents = [];

      data.articles.forEach(article => {
        titles.push(article.title);
        contents.push(article.content || article.description || 'Content not available');
      });

      // Log the titles and contents arrays
      console.log('Titles:', titles);
      console.log('Contents:', contents);

      return { titles, contents };
    } else {
      console.error('Failed to fetch news:', data.message);
      return { titles: [], contents: [] };
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    return { titles: [], contents: [] };
  }
}

module.exports = fetchNews;
