import Image from 'next/image';
import { useContext } from 'react';
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
          {items.map(item => (
            <div className={styles.imageContainer} key={item.original}>
              <Image
                priority
                src={item.original}
                fill
                className={styles.image}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
