import Head from 'next/head';
import useSWR, { useSWRConfig } from 'swr';
import { request } from 'graphql-request';

import Layout from '../../components/layout';
import EventCard from '../../components/eventCard';
import Timeline from '../../components/timeline';
import ProjectHeader from '../../components/projectHeader';
import { getAllProjectIds, setEvent, setProject } from '../../requests/projectRequests';
import styles from './project.module.scss';
import { useCallback, useMemo } from 'react';

const fetcher = query => request('http://localhost:8080/graphql', query);

export async function getStaticPaths() {
  const paths = await getAllProjectIds();

  return {
    paths,
    fallback: false,
  };
}

function groupEvents(events) {
  return events.reduce((groupedEvents, currentEvent) => {
    if (currentEvent.type == 'MIDDLE') {
      const startEventIndex = groupedEvents.findIndex(
        otherEvent => otherEvent.type == 'START' && otherEvent.topic == currentEvent.topic,
      );

      const startEvent = groupedEvents[startEventIndex];
      startEvent.middle = startEvent.middle || [];
      startEvent.middle.push(currentEvent);
    } else if (currentEvent.type == 'END') {
      const startEventIndex = groupedEvents.findIndex(
        otherEvent => otherEvent.type == 'START' && otherEvent.topic == currentEvent.topic,
      );

      const startEvent = groupedEvents[startEventIndex];
      startEvent.end = currentEvent;
    } else {
      groupedEvents.push({ ...currentEvent });
    }

    return groupedEvents;
  }, []);
}

export async function getStaticProps({ params }) {
  // const project = await getProject(params.id);

  // return {
  //   props: {
  //     ...project,
  //     groupedEvents: groupEvents(project.events),
  //   },
  // };

  return {
    props: {
      id: params.id,
    },
  };
}

function useGetProject(data) {
  return useMemo(() => {
    let project = null;

    if (data) {
      project = {
        ...data.getProject,
        groupedEvents: groupEvents(data.getProject.events) || [],
      };
    }

    return project;
  }, [data, groupEvents]);
}

export default function Post(props) {
  // const { id, title, description, date, tags = [], events = [], groupedEvents = [] } = props;
  const { id } = props;

  const { mutate } = useSWRConfig()
  const { data, error } = useSWR(
    `{
      getProject(id: "${id}") {
        id
        title
        date
        description
        tags { label, type }
        events { id, imgUrl, title, description, date, type, topic }
      }
    }`,
    fetcher,
  );

  const project = useGetProject(data);
  const editEvent = useCallback((eventId, eventProps) => {
    // setEventTitle(id, eventId, title);
    mutate(
      setEvent(id, eventId, eventProps),
      {
        revalidate: true, populateCache: true, optimisticData: {
          ...project,
          events: project.events.map(event => {
            if (event.id == eventId) return { ...event, ...eventProps };
            return event;
          }),
        }
      },
    );
  }, [project, mutate, setEvent, id]);

  const editProject = useCallback((id, projectProps) => {
    mutate(
      setProject(id, projectProps),
      {
        revalidate: true, populateCache: true, optimisticData: {
          ...project,
          ...projectProps,
        }
      },
    );
  }, [project, mutate, setProject, id]);

  if (error) return <div>failed to load</div>
  if (!project) return <div>loading...</div>

  const { title, description, date, tags = [], events = [], groupedEvents = [] } = project;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <section className={styles.headerSection}>
        <ProjectHeader {...project} editProject={editProject} />
      </section>
      <section className={styles.timelineSection}>
        <h2 className={styles.timelineTitle}>Timeline</h2>
        <div className={styles.timeline}>
          <Timeline events={groupedEvents} projectId={id} />
        </div>
      </section>
      <section className={styles.eventsSection}>
        <h2 className={styles.eventsTitle}>Events</h2>
        <ul className={styles.events}>
          {events.map(event =>
            <EventCard
              key={event.id}
              {...event}
              editEvent={editEvent}
            />)}
        </ul>
      </section>
    </Layout>
  )
}
