import Image from 'next/image';
import Link from 'next/link';

import SettingsIcon from './settings-icon';
import utilStyles from '../styles/utils.module.scss';
import styles from './menu.module.scss';
import { useContext } from 'react';
import UserContext from '../contexts/userContext';

export default function Menu({ children }) {
  const [user, setUser] = useContext(UserContext);

  return (
    <>
      <div className={styles.profile}>
        <Image
          priority
          src="/images/profile.jpg"
          className={utilStyles.borderCircle}
          height={32}
          width={32}
          alt=""
        />

        {user && <span className={styles.userName}>{user.name}</span>}
      </div>

      {children}

      <ul className={`${styles.menuItems}`}>
        <li>
          <Link href="/create-project" className={styles.button}>
            Create Project
          </Link>
        </li>
        <li>
          <Link href="/integrations" className={utilStyles.colorInherit}>
            Integrations
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
