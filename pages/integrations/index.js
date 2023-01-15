import Head from 'next/head';

import styles from './integrations.module.scss';
import Layout from '../../components/layout';
import { TwitterIntegration } from './twitterIntegration';

export default function Integrations(props) {
  return (
    <Layout>
      <Head>
        <title>Integrations</title>
      </Head>
      <section className={styles.titleSection}>
        <h2 className={styles.title}>Integrations</h2>
      </section>
      <section className={styles.integrationsSection}>
        <TwitterIntegration />
      </section>
    </Layout>
  );
}
