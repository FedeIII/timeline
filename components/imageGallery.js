import Image from 'next/image';
import { useContext, useState } from 'react';
import GalleryContext from '../contexts/galleryContext';
import styles from './imageGallery.module.scss';

export default function ImageGallery(props) {
  const { images, initialImage, isOpen } = props;

  const { closeGallery } = useContext(GalleryContext);

  const items = images.map(url => ({
    original: url,
  }));

  if (!isOpen) return '';

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalOverlay} onClick={closeGallery} />
      <div className={styles.galleryContainer}>
        <div
          className={styles.galleryContent}
          style={{ width: `calc(100% * ${items.length})` }}
        >
          {items.map((item, i) => (
            <div className={styles.imageContainer}>
              <img src={item.original} className={styles.image} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
