import * as cheerio from 'cheerio';
import { ContentParser, ParsedArticle } from './parser.interface';

export class RssParser implements ContentParser {
  async parse(xml: string, sourceName: string): Promise<ParsedArticle[]> {
    const $ = cheerio.load(xml, { xmlMode: true });
    const articles: ParsedArticle[] = [];

    $('item, entry').each((_index, element) => {
      const isAtom = element.tagName === 'entry';

      const title = $(element).find('title').first().text().trim();

      let link = '';
      if (isAtom) {
        link =
          $(element)
            .find('link[rel="alternate"]')
            .first()
            .attr('href')
            ?.trim() ??
          $(element).find('link').first().attr('href')?.trim() ??
          '';
      } else {
        link = $(element).find('link').first().text().trim();
      }

      let body = '';
      if (isAtom) {
        body =
          $(element).find('content').first().text().trim() ||
          $(element).find('summary').first().text().trim();
      } else {
        const contentEncoded = $(element)
          .find('content\\:encoded, encoded')
          .first()
          .text()
          .trim();
        const description = $(element)
          .find('description')
          .first()
          .text()
          .trim();
        body = contentEncoded || description;
      }

      const strippedBody = this.stripHtml(body);
      if (!title || !link || !strippedBody) {
        return;
      }

      const guid =
        (isAtom
          ? $(element).find('id').first().text().trim()
          : $(element).find('guid').first().text().trim()) ||
        (isAtom ? '' : ($(element).attr('rdf:about')?.trim() ?? '')) ||
        link;

      articles.push({
        title,
        url: link,
        body: strippedBody,
        sourceName,
        guid,
        imageUrl: this.extractImage($, element, body),
      });
    });

    return articles;
  }

  private extractImage(
    $: cheerio.CheerioAPI,
    element: any,
    body: string,
  ): string | undefined {
    const mediaUrl = $(element)
      .find('media\\:content[medium="image"], media\\:thumbnail')
      .first()
      .attr('url')
      ?.trim();
    if (mediaUrl) {
      return mediaUrl;
    }

    const enclosure = $(element).find('enclosure').first();
    const enclosureType = enclosure.attr('type') ?? '';
    const enclosureUrl = enclosure.attr('url')?.trim();
    if (enclosureType.startsWith('image/') && enclosureUrl) {
      return enclosureUrl;
    }

    const itunesImage = $(element)
      .find('itunes\\:image')
      .first()
      .attr('href')
      ?.trim();
    if (itunesImage) {
      return itunesImage;
    }

    const imgMatch = body.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (
      imgMatch &&
      !/(twitter|facebook|favicon|spacer|blank|pixel|share)/i.test(imgMatch[1])
    ) {
      return imgMatch[1];
    }

    return undefined;
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
