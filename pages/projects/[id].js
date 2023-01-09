import Head from 'next/head';
import useSWR, { useSWRConfig } from 'swr';
import { request } from 'graphql-request';

import Layout from '../../components/layout';
import EventCard from '../../components/eventCard';
import Timeline from '../../components/timeline/timeline';
import FormCalendar from '../../components/calendar/formCalendar';
import ProjectHeader from '../../components/projectHeader';
import { getAllProjectIds } from '../../requests/projectRequests';
import styles from './project.module.scss';
import ProjectContext from '../../contexts/projectContext';
import useProject from '../../components/hooks/useProject';

export async function getStaticPaths() {
  const paths = await getAllProjectIds();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  };
}

export default function Project(props) {
  // const { id, title, description, date, tags = [], events = [], groupedEvents = [] } = props;
  const { id } = props;

  const [project, editProject, editEvent, createEvent, deleteEvent, deleteTag] =
    useProject(id);

  if (!project) return <div>loading...</div>;

  const {
    title,
    description,
    tags = [],
    events = [],
    groupedEvents = [],
  } = project;

  const projectDate = events[0] && events[0].date;

  const images = events.map(event => event.imgUrl).filter(i => i);

  return (
    <Layout images={images}>
      <ProjectContext.Provider
        value={{
          project,
          editProject,
          editEvent,
          createEvent,
          deleteEvent,
          deleteTag,
        }}
      >
        <Head>
          <title>{title}</title>
        </Head>
        <section className={styles.headerSection}>
          <ProjectHeader date={projectDate} />
        </section>
        <section className={styles.timelineSection}>
          <h2 className={styles.timelineTitle}>Timeline</h2>
          <FormCalendar events={events} projectId={id} />
          {/* <Timeline events={groupedEvents} projectId={id} projectStart={projectDate} /> */}
        </section>
        <section className={styles.eventsSection}>
          <h2 className={styles.eventsTitle}>Events</h2>
          <ul className={styles.events}>
            {events.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </ul>
        </section>
      </ProjectContext.Provider>
    </Layout>
  );
}
