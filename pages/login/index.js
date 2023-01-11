import Head from 'next/head';
import Link from 'next/link';

import Layout, { siteTitle } from '../../components/layout';
import styles from './index.module.scss';

export default function Login(props) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.main}>
        <h2 className={styles.welcome}>Welcome to Timeline</h2>
        <Link href="/integrations" className={styles.login}>
          Login
        </Link>
      </section>
    </Layout>
  );
}
