import { ContentParser } from './parser.interface';
import { RssParser } from './rss.parser';

export class ParserFactory {
  static create(type: string): ContentParser {
    switch (type) {
      case 'rss':
        return new RssParser();
      default:
        throw new Error(`Unsupported parser type: ${type}`);
    }
  }
}
