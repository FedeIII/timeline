import Head from 'next/head';
import Link from 'next/link';
import { useMemo } from 'react';
import format from 'date-fns/format';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth';
import isSameMonth from 'date-fns/isSameMonth';
import isSameYear from 'date-fns/isSameYear';

import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.scss';
import styles from './index.module.scss';
import { getAllProjects } from '../requests/projectRequests';
import { useDaysProjects } from '../components/hooks/useDays';
import DayCell from '../components/calendar/dayCell';
import EditProjects from '../components/index/editProjects';

function getCellWidth(events) {
  let isAnyEvent = false;
  let isAnyBorderEvent = false;
  let isAnyMiddleEvent = false;

  events.forEach(event => {
    if (event) {
      isAnyEvent = true;
      if (event.type === 'START' || event.type === 'END')
        isAnyBorderEvent = true;
      if (event.type === 'MIDDLE') isAnyMiddleEvent = true;
    }
  });

  let cellWidth = 70;
  if (isAnyMiddleEvent) cellWidth = 110;
  if (isAnyBorderEvent) cellWidth = 118;
  if (isAnyEvent && !isAnyMiddleEvent && !isAnyBorderEvent) cellWidth = 126;

  return cellWidth;
}

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

function useLastDates(projects) {
  return useMemo(() => {
    return projects.map(
      project =>
        project.events[project.events.length - 1] &&
        project.events[project.events.length - 1].date
    );
  }, [projects]);
}

export default function Home(props) {
  const { projects } = props;

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
            <div className={styles.years}>
              {days.reduce((yearsComponents, day, index) => {
                const { date } = day;
                if (index === 0 || date.substring(5) === '01-01') {
                  const width = days
                    .slice(
                      index,
                      days.findIndex(
                        (d, i) =>
                          i > index &&
                          !isSameYear(new Date(d.date), new Date(date))
                      )
                    )
                    .reduce((w, day) => w + getCellWidth(day.events), 0);

                  return [
                    ...yearsComponents,
                    <div
                      className={styles.dateTagContainer}
                      style={{ width: width + 'px' }}
                    >
                      <span className={styles.dateTag}>
                        {format(new Date(date), 'yyyy')}
                      </span>
                    </div>,
                  ];
                }

                return yearsComponents;
              }, [])}
            </div>

            <div className={styles.months}>
              {days.reduce((monthsComponents, day, index) => {
                const { date } = day;

                if (index === 0 || isFirstDayOfMonth(new Date(date))) {
                  const width = days
                    .slice(
                      index,
                      days.findIndex(
                        (d, i) =>
                          i > index &&
                          !isSameMonth(new Date(d.date), new Date(date))
                      )
                    )
                    .reduce((w, day) => w + getCellWidth(day.events), 0);

                  return [
                    ...monthsComponents,
                    <div
                      className={styles.dateTagContainer}
                      style={{ width: width + 'px' }}
                    >
                      <span className={styles.dateTag}>
                        {format(new Date(date), 'MMMM')}
                      </span>
                    </div>,
                  ];
                }

                return monthsComponents;
              }, [])}
            </div>

            <div className={styles.cells}>
              {days.map((day, index) => {
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

          <EditProjects projects={projects} />
        </div>
      </section>
    </Layout>
  );
}
