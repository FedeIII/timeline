import { useContext, useMemo } from 'react';
import styles from './integrations.module.scss';
import EnvContext from '../../contexts/envContext';
import UserContext from '../../contexts/userContext';
import Link from 'next/link';

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
export function TwitterIntegration(props) {
  const envContext = useContext(EnvContext) || {};
  const { TWITTER_REDIRECT_URI, TWITTER_CLIENT_ID } = envContext;
  const twitterOauthUrl = useTwitterOauthUrl(
    TWITTER_REDIRECT_URI,
    TWITTER_CLIENT_ID
  );

  const userContext = useContext(UserContext) || [];
  const [user, setUser] = userContext;

  const isLoggedWithTwitter = !!(
    user &&
    user.integrations &&
    user.integrations.twitter
  );

  return (
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
  );
}
