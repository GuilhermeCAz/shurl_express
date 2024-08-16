import crypto from 'crypto';
import { appDataSource } from '../dataSource';
import { URL } from '../models/URL';

export class URLService {
  private urlRepository = appDataSource.getRepository(URL);
  async shortenURL(originalURL: string): Promise<URL> {
    const existingURL = await this.urlRepository.findOne({
      where: { originalURL },
    });

    if (existingURL) return existingURL;

    const slugLength = 6,
      slug = crypto.randomBytes(slugLength).toString('hex'),
      newURL = this.urlRepository.create({ originalURL, slug });

    await this.urlRepository.save(newURL);

    return newURL;
  }

  async getOriginalURL(slug: string): Promise<URL | null> {
    return this.urlRepository.findOne({ where: { slug } });
  }
}
