import Image from 'next/image';
import { useCallback, useContext } from 'react';
import GalleryContext from '../contexts/galleryContext';
import styles from './projectImage.module.scss';

export default function ProjectImage(props) {
  const { className, imgUrl, alt } = props;

  const { openGallery } = useContext(GalleryContext);

  const onImageClick = useCallback(() => {
    openGallery();
  }, [openGallery]);

  return (
    <div
      className={`${styles.imageContainer} ${className}`}
      onClick={onImageClick}
    >
      <Image
        priority
        src={imgUrl}
        className={styles.image}
        layout="fill"
        alt={alt}
      />
    </div>
  );
}
