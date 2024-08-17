import { nanoid } from 'nanoid';
import { IsNull } from 'typeorm';
import { appDataSource } from '../dataSource.js';
import { URL } from '../models/URL.js';
import { User } from '../models/User.js';

const generateSlug = (length: number): string => nanoid(length);

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
  // eslint-disable-next-line max-lines-per-function
  async shortenURL(
    originalURL: string,
    userId?: string,
  ): Promise<{
    originalURL: string;
    shortURL: string;
    clickCount: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }> {
    const existingURL = await this.urlRepository.findOneBy({
      originalURL,
      deletedAt: IsNull(),
      user: { id: userId },
    });

    if (existingURL) {
      return {
        originalURL: existingURL.originalURL,
        shortURL: `http://localhost:3000/${existingURL.slug}`,
        clickCount: existingURL.clickCount,
        createdAt: existingURL.createdAt.toISOString(),
        updatedAt: existingURL.updatedAt.toISOString(),
        // eslint-disable-next-line no-ternary
        deletedAt: existingURL.deletedAt
          ? existingURL.deletedAt.toISOString()
          : null,
      };
    }

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

    return {
      originalURL: newURL.originalURL,
      shortURL: `http://localhost:3000/${newURL.slug}`,
      clickCount: newURL.clickCount,
      createdAt: newURL.createdAt.toISOString(),
      updatedAt: newURL.updatedAt.toISOString(),
      // eslint-disable-next-line no-ternary
      deletedAt: newURL.deletedAt ? newURL.deletedAt.toISOString() : null,
    };
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
