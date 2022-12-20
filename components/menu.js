import Image from 'next/image';
import Link from 'next/link';

import SettingsIcon from './settings-icon';
import utilStyles from '../styles/utils.module.scss';
import styles from './menu.module.scss';

export default function Menu({ children }) {
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

      {children}

      <ul className={`${styles.menuItems}`}>
        <li>
          <Link href="/create-project" className={styles.button}>
            Create Project
          </Link>
        </li>
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
