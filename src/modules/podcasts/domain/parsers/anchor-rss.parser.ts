import * as cheerio from 'cheerio';

export interface ParsedPodcastEpisode {
  title: string;
  description: string;
  link?: string;
  guid?: string;
  audioUrl?: string;
  coverImageUrl?: string;
  publishDate?: Date;
  durationInMinutes?: number;
}

export class AnchorRssParser {
  parse(xml: string): ParsedPodcastEpisode[] {
    const $ = cheerio.load(xml, { xmlMode: true });
    const episodes: ParsedPodcastEpisode[] = [];

    $('item').each((_index, element) => {
      const title = $(element).find('title').first().text().trim();
      const description = $(element).find('description').first().text().trim();
      const summary = $(element).find('itunes\\:summary').first().text().trim();
      const link = $(element).find('link').first().text().trim();
      const guid = $(element).find('guid').first().text().trim();
      const pubDate = $(element).find('pubDate').first().text().trim();
      const duration = $(element)
        .find('itunes\\:duration')
        .first()
        .text()
        .trim();
      const coverImageUrl = $(element)
        .find('itunes\\:image')
        .first()
        .attr('href');
      const audioUrl = $(element).find('enclosure').first().attr('url');

      const body = summary || description;

      if (title && body) {
        episodes.push({
          title,
          description: this.stripHtml(body),
          link,
          guid,
          audioUrl,
          coverImageUrl,
          publishDate: pubDate ? new Date(pubDate) : undefined,
          durationInMinutes: this.parseDuration(duration),
        });
      }
    });

    return episodes;
  }

  private parseDuration(duration: string): number | undefined {
    const parts = duration.split(':').map(Number);
    if (parts.length === 0 || parts.some((part) => Number.isNaN(part))) {
      return undefined;
    }
    if (parts.length === 3) {
      return parts[0] * 60 + parts[1] + Math.round(parts[2] / 60);
    }
    if (parts.length === 2) {
      return parts[0] + Math.round(parts[1] / 60);
    }
    return Math.round(parts[0] / 60);
  }

  private stripHtml(html: string): string {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
