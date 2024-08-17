import crypto from 'crypto';
import { IsNull } from 'typeorm';
import { appDataSource } from '../dataSource';
import { URL } from '../models/URL';
import { User } from '../models/User';

const generateSlug = (length: number): string =>
  crypto.randomBytes(length).toString('base64url');

export class URLService {
  private urlRepository = appDataSource.getRepository(URL);
  private userRepository = appDataSource.getRepository(User);

  private async findUniqueSlug(length: number): Promise<string> {
    let slug: string, urlExists: URL | null;

    do {
      slug = generateSlug(length);
      // eslint-disable-next-line no-await-in-loop
      urlExists = await this.urlRepository.findOneBy({ slug });
    } while (urlExists);

    return slug;
  }
  async shortenURL(originalURL: string, userId?: string): Promise<URL> {
    const existingURL = await this.urlRepository.findOneBy({
      originalURL,
      deletedAt: IsNull(),
      user: { id: userId },
    });

    if (existingURL) return existingURL;

    const slugLength = 6,
      user = await this.userRepository.findOneBy({ id: userId }),
      slug = await this.findUniqueSlug(slugLength),
      newURL = this.urlRepository.create({
        originalURL,
        slug,
        // eslint-disable-next-line no-undefined
        user: user ?? undefined,
      });

    await this.urlRepository.save(newURL);

    return newURL;
  }

  async updateURL(
    slug: string,
    userId: string,
    newOriginalURL: string,
  ): Promise<URL | null> {
    const url = await this.urlRepository.findOneBy({
      slug,
      user: { id: userId },
      deletedAt: IsNull(),
    });

    if (!url) return null;

    url.originalURL = newOriginalURL;
    await this.urlRepository.save(url);

    return url;
  }

  async getOriginalURL(slug: string): Promise<URL | null> {
    const url = await this.urlRepository.findOneBy({
      slug,
      deletedAt: IsNull(),
    });

    if (url) {
      url.clickCount += 1;
      await this.urlRepository.save(url);
    }

    return url;
  }

  async listURLs(userId: string): Promise<URL[]> {
    return this.urlRepository.find({
      where: {
        user: { id: userId },
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteURL(slug: string, userId: string): Promise<void> {
    const url = await this.urlRepository.findOneBy({
      slug,
      user: { id: userId },
      deletedAt: IsNull(),
    });

    if (url) {
      url.deletedAt = new Date();
      await this.urlRepository.save(url);
    } else throw new Error('URL not found or not accessible by user');
  }
}
