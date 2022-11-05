import Image from 'next/image';
import Link from 'next/link';

import SettingsIcon from './settings-icon';
import utilStyles from '../styles/utils.module.scss';
import styles from './menu.module.scss';

export default function Layout({ children, home }) {
  return (
    <>
      <Link href="/" className={styles.profileLink}>
        <Image
          priority
          src="/images/profile.jpg"
          className={utilStyles.borderCircle}
          height={32}
          width={32}
          alt=""
        />
      </Link>
      <ul className={`${styles.menuItems}`}>
        <li>
          <Link href="/" className={utilStyles.colorInherit}>
            Timeline
          </Link>
        </li>
        <li>
          <Link href="/" className={utilStyles.colorInherit}>
            <SettingsIcon />
          </Link>
        </li>
      </ul>
    </>
  );
}