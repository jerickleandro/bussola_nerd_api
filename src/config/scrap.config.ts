import { registerAs } from '@nestjs/config';

export interface ScrapPortal {
  name: string;
  url: string;
  type: 'rss';
}

export const scrapConfig = registerAs('scrap', () => ({
  apiKey: process.env.SCRAP_API_KEY,
  cronExpression: process.env.SCRAP_CRON ?? '0 */12 * * *',
  portals: [
    { name: 'denofgeek', url: 'https://www.denofgeek.com/feed/', type: 'rss' },
    { name: 'ign', url: 'https://br.ign.com/feed.xml', type: 'rss' },
    {
      name: 'slashdot',
      url: 'https://rss.slashdot.org/Slashdot/slashdotMain',
      type: 'rss',
    },
    { name: 'vox', url: 'https://www.vox.com/rss/index.xml', type: 'rss' },
    { name: 'techcrunch', url: 'https://techcrunch.com/feed/', type: 'rss' },
  ] as ScrapPortal[],
  tagTopics: [
    'Games',
    'Cinema',
    'Séries & TV',
    'Animes & Mangás',
    'Quadrinhos',
    'Literatura',
    'RPG & Board Games',
    'Cosplay',
    'Colecionáveis',
    'Eventos',
    'Fandoms',
    'Tecnologia',
    'IA',
    'Internet',
    'Ciência & Futuro',
    'Franquias & Universos',
    'Celebridades',
    'Música',
    'Nostalgia',
    'Curiosidades',
  ],
}));
