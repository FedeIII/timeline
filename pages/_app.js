import { useEffect, useState } from 'react';
import EnvContext from '../contexts/envContext';
import UserContext from '../contexts/userContext';
import '../styles/global.scss';

async function fetchEnvVars(setEnvVars) {
  const response = await fetch('https://timeline-service.herokuapp.com/handshake');
  // const response = await fetch('http://127.0.0.1:8080/handshake');
  setEnvVars(await response.json());
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

  return (
    <UserContext.Provider value={[user, setUser]}>
      <EnvContext.Provider value={envVars}>
        <Component {...pageProps} />
      </EnvContext.Provider>
    </UserContext.Provider>
  );
}
