import { useContext, useState } from 'react';
import Gallery from 'react-image-gallery';
import GalleryContext from '../contexts/galleryContext';
import styles from './imageGallery.module.scss';

export default function ImageGallery(props) {
  const { images, initialImage, isOpen } = props;

  const [selectedImage, setSelectedImage] = useState(initialImage);

  const items = images.map(url => ({
    original: url,
  }));

  if (!isOpen) return '';

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryOverlay} />
      <div className={styles.galleryContent}>
        <Gallery items={items} />
      </div>
    </div>
  );
}
