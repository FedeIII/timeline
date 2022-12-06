import Head from 'next/head';
import styles from './layout.module.scss';
import Link from 'next/link';

import Menu from './menu';
import ImageGallery from './imageGallery';
import GalleryContext from '../contexts/galleryContext';
import { useCallback, useState } from 'react';

const name = 'Timeline';
export const siteTitle = 'Timeline';

function useGallery() {
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const openGallery = useCallback(() => setGalleryOpen(true), [setGalleryOpen]);
  const closeGallery = useCallback(
    () => setGalleryOpen(false),
    [setGalleryOpen]
  );

  return [isGalleryOpen, openGallery, closeGallery];
}

export default function Layout(props) {
  const { children, images, home } = props;

  const [isGalleryOpen, openGallery, closeGallery] = useGallery();

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <GalleryContext.Provider
        value={{ isGalleryOpen, openGallery, closeGallery }}
      >
        <header className={styles.header}>
          <Menu />
        </header>

        <ImageGallery isOpen={isGalleryOpen} images={images} />
        <main className={styles.content}>{children}</main>

        <footer className={styles.footer}>
          <Link href="/">← Back to home</Link>
        </footer>
      </GalleryContext.Provider>
    </div>
  );
}
