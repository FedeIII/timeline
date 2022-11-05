import Image from 'next/image';

import styles from './event.module.scss';

export default function Event(props) {
  const { imgUrl, title, description, date } = props;

  return (
    <li className={styles.event}>
      {imgUrl && <Image
        priority
        src={imgUrl}
        className={styles.eventImage}
        height={256}
        width={256}
        alt={title}
      />}
      <div className={styles.eventInfo}>
        <h3 className={styles.eventTitle}>{title}</h3>
        <div className={styles.eventDescription}>{description}</div>
        <div className={styles.eventDate}>{date}</div>
      </div>
    </li>
  );
}