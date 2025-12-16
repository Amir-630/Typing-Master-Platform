// backend/src/services/text.service.ts
import axios from 'axios';

export class TextService {
  static async getRandomQuote(): Promise<string> {
    try {
      const response = await axios.get('https://api.quotable.io/random');
      return response.data.content;
    } catch (error) {
      return this.getFallbackText();
    }
  }
  
  static async getNewsArticle(): Promise<string> {
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          country: 'us',
          apiKey: process.env.NEWS_API_KEY
        }
      });
      return response.data.articles[0]?.content || this.getFallbackText();
    } catch (error) {
      return this.getFallbackText();
    }
  }
  
  private static getFallbackText(): string {
    const texts = [
      "The quick brown fox jumps over the lazy dog.",
      "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
      "Typing practice helps improve speed, accuracy, and efficiency in computer use.",
      "Regular practice is key to mastering any skill, including typing."
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  }
}