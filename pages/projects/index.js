import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import Layout, { siteTitle } from '../../components/layout';
import utilStyles from '../../styles/utils.module.scss';
import styles from './index.module.scss';
import { getAllProjects } from '../../requests/projectRequests';
import { useDaysProjects } from '../../components/hooks/useDays';
import DayCell from '../../components/calendar/dayCell';
import EditProjects from '../../components/index/editProjects';
import { DateTags } from '../../components/calendar/dateTags';
import { getUser } from '../../requests/userRequests';

export async function getServerSideProps(context) {
  let projects;
  try {
    const user = await getUser(context.req.cookies);
    projects = await getAllProjects(user.id);
  } catch (error) {
    console.log('Error getting projects', error);
    projects = [];
  }

  return {
    props: { projects },
  };
}

function useFirstDates(projects) {
  return useMemo(() => {
    return projects.map(project => project.events[0] && project.events[0].date);
  }, [projects]);
}

function useLastDates(projects) {
  return useMemo(() => {
    return projects.map(
      project =>
        project.events[project.events.length - 1] &&
        project.events[project.events.length - 1].date
    );
  }, [projects]);
}

export default function ProjectIndex(props) {
  const { projects: initProjects } = props;

  const [projects, setProjects] = useState(initProjects);

  const days = useDaysProjects(projects);

  const firstDates = useFirstDates(projects);
  const lastDates = useLastDates(projects);

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
            <DateTags days={days} />
            <div className={styles.cells}>
              {days.map(day => {
                const { date, events, isOngoingEvents } = day;

                return (
                  <DayCell
                    date={date}
                    events={events}
                    isOngoingEvents={isOngoingEvents}
                    isEditMode
                    firstDates={firstDates}
                    lastDates={lastDates}
                    key={date}
                  />
                );
              })}
            </div>
          </div>

          <EditProjects projects={projects} setProjects={setProjects} />
        </div>
      </section>
    </Layout>
  );
}
