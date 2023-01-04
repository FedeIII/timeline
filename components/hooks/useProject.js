import { useEffect, useState } from 'react';
import {
  getProject as getProjectRequest,
  setEvent as setEventRequest,
  setProject as setProjectRequest,
  addEvent as addEventRequest,
  deleteEvent as deleteEventRequest,
  deleteTag as deleteTagRequest,
  groupProjectEvents,
} from '../../requests/projectRequests';

export default function useProject(id) {
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
      }),
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
    localProject.events = localProject.events.sort((event1, event2) =>
      event1.date > event2.date ? 1 : -1
    );
    localProject = groupProjectEvents(localProject);
    setProject(localProject);

    const remoteProject = await addEventRequest(id, event);
    setProject(remoteProject);
  }

  async function deleteEvent(eventId) {
    let localProject = { ...project };
    localProject.events = localProject.events.filter(
      event => event.id != eventId
    );
    localProject = groupProjectEvents(localProject);
    setProject(localProject);

    const remoteProject = await deleteEventRequest(id, eventId);
    setProject(remoteProject);
  }

  async function deleteTag(tagLabel) {
    let localProject = { ...project };
    localProject.tags = localProject.events.filter(
      tag => tag.label != tagLabel
    );

    setProject(localProject);

    const remoteProject = await deleteTagRequest(id, tagLabel);
    setProject(remoteProject);
  }

  return [project, editProject, editEvent, createEvent, deleteEvent, deleteTag];
}
