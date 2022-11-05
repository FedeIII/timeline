import Head from 'next/head';

import Layout from '../../components/layout';
import Event from '../../components/event';
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
  const { title, description, date, tags = [], events = [] } = props;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <section className={styles.headerSection}>
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
      <section className={styles.timelineSection}>
        <h2 className={styles.timelineTitle}>Timeline</h2>
        <div className={styles.timeline}><hr /></div>
      </section>
      <section className={styles.eventsSection}>
        <h2 className={styles.eventsTitle}>Events</h2>
        <ul className={styles.events}>
          {events.map(event => <Event {...event} key={`${title}-${date}`} />)}
        </ul>
      </section>
    </Layout>
  )
}
