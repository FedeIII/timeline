import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';
import { getAllProjectIds, getProject } from '../../queries/projectQueries';
import styles from './project.module.scss';

export async function getStaticPaths() {
  const paths = await getAllProjectIds();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const project = await getProject(params.id);

  return {
    props: project,
  };
}

export default function Post(props) {
  const { title, description, date, tags = [] } = props;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <section className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.info}>
          <div className={styles.description}>{description}</div>
          <div className={styles.otherInfo}>
            <span className={styles.date}>{date}</span>
            <ul className={styles.tags}>
              {tags.map(tag => <li key={tag.label}>{tag.label}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className={styles.timeline}>
        Timeline here
      </section>
      <section className={styles.events}>
        Events here
      </section>
    </Layout>
  )
}
