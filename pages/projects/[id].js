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

function useGroupEvents(projectData) {
  let project = null;

  if (projectData) {
    project = {
      ...projectData,
      groupedEvents: groupEvents(projectData.events) || [],
    };
  }

  return project;
}

function useProject(id) {
  const [project, setProject] = useState(null);
  // const { mutate } = useSWRConfig()
  let error;

  const response = useSWR(`{
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

  const data = response.data;
  const mutate = response.mutate;
  error = response.error;

  useEffect(() => {
    if (!project && data) {
      const projectData = useGroupEvents(data.getProject);

      setProject(projectData);
    }
  }, [data, project, useGroupEvents, setProject]);

  async function editEvent(eventId, eventProps) {
    mutate(data => {
      let newProject = {
        ...data.getProject,
        events: data.getProject.events.map(event => {
          if (event.id == eventId) return { ...event, ...eventProps };
          return event;
        })
      };

      newProject = useGroupEvents(newProject);
      setProject(newProject);
    });

    setEventRequest(id, eventId, eventProps);
  }

  async function editProject(id, projectProps) {
    mutate(data => {
      let newProject = {
        ...data.getProject,
        ...projectProps,
      };

      if (newProject.events) {
        newProject = useGroupEvents(newProject);
      }

      setProject(newProject);
    });

    setProjectRequest(id, projectProps);
  }

  async function createEvent(event) {
    mutate(data => {
      let newProject = { ...data.getProject };
      newProject.events.push(event);
      newProject.events = newProject.events.sort(
        (event1, event2) => event1.date > event2.date ? 1 : -1,
      );

      newProject = useGroupEvents(newProject);

      setProject(newProject);
    });

    addEventRequest(id, event);
  }

  async function deleteEvent(eventId) {
    mutate(data => {
      let newProject = { ...data.getProject };
      newProject.events = newProject.events.filter(event => event.id != eventId);
      newProject = useGroupEvents(newProject);

      setProject(newProject);
    });

    deleteEventRequest(id, eventId);
  }

  return [project, error, editProject, editEvent, createEvent, deleteEvent]
}

export default function Post(props) {
  // const { id, title, description, date, tags = [], events = [], groupedEvents = [] } = props;
  const { id } = props;

  const [
    project,
    error,
    editProject,
    editEvent,
    createEvent,
    deleteEvent,
  ] = useProject(id);

  if (error) return <div>failed to load</div>
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
