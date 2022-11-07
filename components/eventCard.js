import Image from 'next/image';

import styles from './eventCard.module.scss';

export default function EventCard(props) {
  const { imgUrl, title, description, date } = props;

  return (
    <li className={styles.eventCard}>
      {imgUrl && <Image
        priority
        src={imgUrl}
        className={styles.eventCardImage}
        height={256}
        width={256}
        alt={title}
      />}
      <div className={styles.eventCardInfo}>
        <h3 className={styles.eventCardTitle}>{title}</h3>
        <div className={styles.eventCardDescription}>{description}</div>
        <div className={styles.eventCardDate}>{date}</div>
      </div>
    </li>
  );
}