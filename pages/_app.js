import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import EnvContext from '../contexts/envContext';
import UserContext from '../contexts/userContext';
import { handshakeRequest } from '../requests/handshakeRequest';
import '../styles/global.scss';

async function fetchEnvVars(setEnvVars) {
  const envVars = await handshakeRequest();
  setEnvVars(envVars);
}

function useEnvVars() {
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    fetchEnvVars(setEnvVars);
  }, []);

  return envVars;
}

export default function App(props) {
  const { Component, pageProps } = props;

  const envVars = useEnvVars();
  const [user, setUser] = useState(null);
  const { ME_URL, OAUTH_COOKIE } = envVars;

  useEffect(() => {
    (async function () {
      try {
        if (!ME_URL) return;
        const url =
          ME_URL +
          '?' +
          new URLSearchParams({
            token: Cookies.get(OAUTH_COOKIE),
          });
        const userReq = await fetch(url, { credentials: 'include' });
        const user = await userReq.json();
        if (user) setUser(user);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [ME_URL]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <EnvContext.Provider value={envVars}>
        <Component {...pageProps} />
      </EnvContext.Provider>
    </UserContext.Provider>
  );
}
