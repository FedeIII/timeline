import Head from 'next/head';
import Link from 'next/link';
import format from 'date-fns/format';

import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.scss';
import styles from './index.module.scss';
import { getAllProjects } from '../requests/projectRequests';
import { useDaysProjects } from '../components/hooks/useDays';
import DayCell from '../components/calendar/dayCell';

export async function getStaticProps() {
  const projects = await getAllProjects();

  return {
    props: { projects },
  };
}

export default function Home(props) {
  const { projects } = props;

  const days = useDaysProjects(projects);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.timelines}>
        <h2 className={utilStyles.headingLg}>Timelines</h2>
        <div className={styles.calendar}>
          <div className={styles.projects}>
            <span className={styles.projectsHeader}>Projects</span>
            {projects.map((project, i) => (
              <div className={styles.projectBody}>{project.title}</div>
            ))}
          </div>
          <div className={styles.days}>
            {days.map(day => {
              const { date, events, isOngoingEvents } = day;

              return (
                <DayCell
                  date={date}
                  eventsAtDay={events}
                  isOngoingEvents={isOngoingEvents}
                  isEditMode
                  key={date}
                />
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
