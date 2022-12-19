import Head from 'next/head';

import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.scss';
import styles from './index.module.scss';
import { getAllProjects } from '../requests/projectRequests';
import { useDaysProjects } from '../components/hooks/useDays';
import DayCell from '../components/calendar/dayCell';
import Link from 'next/link';
import { useMemo } from 'react';

export async function getStaticProps() {
  const projects = await getAllProjects();

  return {
    props: { projects },
  };
}

function useFirstDates(projects) {
  return useMemo(() => {
    return projects.map(project => project.events[0] && project.events[0].date);
  }, [projects]);
}

export default function Home(props) {
  const { projects } = props;

  const days = useDaysProjects(projects);

  const firstDates = useFirstDates(projects);

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
            {projects.map(project => (
              <Link
                href={`/projects/${project.id}`}
                className={styles.projectBody}
                key={project.title}
              >
                {project.title}
              </Link>
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
                  firstDates={firstDates}
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
