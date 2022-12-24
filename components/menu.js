import Image from 'next/image';
import Link from 'next/link';

import SettingsIcon from './settings-icon';
import utilStyles from '../styles/utils.module.scss';
import styles from './menu.module.scss';
import { useContext, useEffect, useMemo, useState } from 'react';
import EnvContext from '../contexts/envContext';
import UserContext from '../contexts/userContext';

function useTwitterOauthUrl(redirect_uri, client_id) {
  return useMemo(() => {
    const qs = new URLSearchParams({
      redirect_uri,
      client_id,
      state: 'state',
      response_type: 'code',
      code_challenge: 'y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8',
      code_challenge_method: 'S256',
      scope: ['tweet.read', 'tweet.write', 'users.read'].join(' '),
    }).toString();
    return `https://twitter.com/i/oauth2/authorize?${qs}`;
  }, [redirect_uri, client_id]);
}

export default function Menu({ children }) {
  const { TWITTER_REDIRECT_URI, TWITTER_CLIENT_ID, ME_URL } =
    useContext(EnvContext);
  const twitterOauthUrl = useTwitterOauthUrl(
    TWITTER_REDIRECT_URI,
    TWITTER_CLIENT_ID
  );

  const [user, setUser] = useContext(UserContext);
  useEffect(() => {
    (async function () {
      try {
        if (!ME_URL) return;
        const response = await fetch(ME_URL, { credentials: 'include' });
        const user = await response.json();
        if (user) setUser(user);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [ME_URL]);

  return (
    <>
      <div className={styles.profile}>
        {TWITTER_CLIENT_ID && (
          <Link href={twitterOauthUrl} className={styles.profileLink}>
            <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={32}
              width={32}
              alt=""
            />
          </Link>
        )}

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
