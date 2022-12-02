import Image from 'next/image';
import styles from './projectImage.module.scss';

export default function ProjectImage(props) {
  const { className, imgUrl, alt } = props;

  return (
    <div className={`${styles.imageContainer} ${className}`}>
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
