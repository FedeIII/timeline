import Head from 'next/head';

import Layout, { siteTitle } from '../components/layout';
import styles from './index.module.scss';

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Home(props) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.main}>
        <h2 className={styles.title}>{siteTitle}</h2>
        <div className={styles.description}>Welcome</div>
      </section>
    </Layout>
  );
}
