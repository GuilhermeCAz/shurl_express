import crypto from 'crypto';
import { IsNull } from 'typeorm';
import { appDataSource } from '../dataSource';
import { URL } from '../models/URL';

const generateSlug = (length: number): string =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('base64url')
    .slice(0, length);

export class URLService {
  private urlRepository = appDataSource.getRepository(URL);

  private async findUniqueSlug(length: number): Promise<string> {
    let slug: string, urlExists: URL | null;

    do {
      slug = generateSlug(length);
      // eslint-disable-next-line no-await-in-loop
      urlExists = await this.urlRepository.findOneBy({ slug });
    } while (urlExists);

    return slug;
  }
  async shortenURL(originalURL: string): Promise<URL> {
    const existingURL = await this.urlRepository.findOneBy({ originalURL });

    if (existingURL) return existingURL;

    const slugLength = 6,
      slug = await this.findUniqueSlug(slugLength),
      newURL = this.urlRepository.create({ originalURL, slug });

    await this.urlRepository.save(newURL);

    return newURL;
  }

  async getOriginalURL(slug: string): Promise<URL | null> {
    const url = await this.urlRepository.findOneBy({ slug });

    if (url) {
      url.clickCount += 1;
      await this.urlRepository.save(url);
    }

    return url;
  }

  async listURLs(): Promise<URL[]> {
    return this.urlRepository.find();
  }

  async deleteURL(slug: string): Promise<void> {
    const url = await this.urlRepository.findOneBy({
      slug,
      deletedAt: IsNull(),
    });

    if (url) {
      url.deletedAt = new Date();
      await this.urlRepository.save(url);
    }
  }
}
