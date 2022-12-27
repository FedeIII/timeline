import Head from 'next/head';

import { useContext, useEffect, useMemo } from 'react';

import styles from './integrations.module.scss';
import EnvContext from '../../contexts/envContext';
import UserContext from '../../contexts/userContext';
import Layout from '../../components/layout';
import Link from 'next/link';
import { it } from 'date-fns/locale';

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

export default function Post(props) {
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

  const isLoggedWithTwitter = !!(
    user &&
    user.integrations &&
    user.integrations.twitter
  );

  return (
    <Layout>
      <Head>
        <title>Integrations</title>
      </Head>
      <section className={styles.titleSection}>
        <h2 className={styles.title}>Integrations</h2>
      </section>
      <section className={styles.integrationsSection}>
        <div className={styles.integration}>
          <Link href={twitterOauthUrl} className={styles.integrationLink}>
            Twitter
          </Link>
          {isLoggedWithTwitter ? (
            <span className={styles.check}>✓</span>
          ) : (
            <span className={styles.check}></span>
          )}
        </div>
      </section>
    </Layout>
  );
}
