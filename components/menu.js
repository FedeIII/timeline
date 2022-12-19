import Image from 'next/image';
import Link from 'next/link';

import SettingsIcon from './settings-icon';
import utilStyles from '../styles/utils.module.scss';
import styles from './menu.module.scss';
import { useCallback } from 'react';

export default function Menu({ children }) {
  const onCreateClick = useCallback(() => {
    
  }, []);

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
          <button className={styles.createButton} onClick={onCreateClick}>
            Create Project
          </button>
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
