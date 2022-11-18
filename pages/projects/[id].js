import Head from 'next/head';
import useSWR, { useSWRConfig } from 'swr';
import { request } from 'graphql-request';

import Layout from '../../components/layout';
import EventCard from '../../components/eventCard';
import Timeline from '../../components/timeline';
import ProjectHeader from '../../components/projectHeader';
import {
  getAllProjectIds,
  getProject as getProjectRequest,
  setEvent as setEventRequest,
  setProject as setProjectRequest,
  addEvent as addEventRequest,
  deleteEvent as deleteEventRequest,
  groupProjectEvents,
} from '../../requests/projectRequests';
import styles from './project.module.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ProjectContext from '../../contexts/projectContext';

const fetcher = query => request('http://localhost:8080/graphql', query);

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

function useProject(id) {
  const [project, setProject] = useState(null);

  useEffect(() => {
    async function requestProject() {
      const project = await getProjectRequest(id);

      setProject(project);
    }

    requestProject();
  }, [id]);

  async function editEvent(eventId, eventProps) {
    let localProject = {
      ...project,
      events: project.events.map(event => {
        if (event.id == eventId) return { ...event, ...eventProps };
        return event;
      })
    };
    localProject = groupProjectEvents(localProject);
    setProject(localProject);

    const remoteProject = await setEventRequest(id, eventId, eventProps);
    setProject(remoteProject);
  }

  async function editProject(id, projectProps) {
    let localProject = {
      ...project,
      ...projectProps,
    };
    localProject = groupProjectEvents(localProject);
    setProject(localProject);

    const remoteProject = await setProjectRequest(id, projectProps);
    setProject(remoteProject);
  }

  async function createEvent(event) {
    let localProject = {
      ...project,
      events: [...project.events, event],
    };
    localProject.events = localProject.events.sort(
      (event1, event2) => event1.date > event2.date ? 1 : -1,
    );
    localProject = groupProjectEvents(localProject);
    setProject(localProject);

    const remoteProject = await addEventRequest(id, event);
    setProject(remoteProject);
  }

  async function deleteEvent(eventId) {
    let localProject = { ...project };
    localProject.events = localProject.events.filter(event => event.id != eventId);
    localProject = groupProjectEvents(localProject);
    setProject(localProject);

    const remoteProject = await deleteEventRequest(id, eventId);
    setProject(remoteProject);
  }

  return [project, editProject, editEvent, createEvent, deleteEvent]
}

export default function Post(props) {
  // const { id, title, description, date, tags = [], events = [], groupedEvents = [] } = props;
  const { id } = props;

  const [
    project,
    editProject,
    editEvent,
    createEvent,
    deleteEvent,
  ] = useProject(id);

  if (!project) return <div>loading...</div>

  const { title, description, date, tags = [], events = [], groupedEvents = [] } = project;

  return (
    <Layout>
      <ProjectContext.Provider value={{
        project,
        editProject,
        editEvent,
        createEvent,
        deleteEvent,
      }}>
        <Head>
          <title>{title}</title>
        </Head>
        <section className={styles.headerSection}>
          <ProjectHeader {...project} />
        </section>
        <section className={styles.timelineSection}>
          <h2 className={styles.timelineTitle}>Timeline</h2>
          <div className={styles.timeline}>
            <Timeline events={groupedEvents} projectId={id} projectStart={date} />
          </div>
        </section>
        <section className={styles.eventsSection}>
          <h2 className={styles.eventsTitle}>Events</h2>
          <ul className={styles.events}>
            {events.map(event =>
              <EventCard key={event.id} {...event} />)}
          </ul>
        </section>
      </ProjectContext.Provider>
    </Layout>
  )
}
