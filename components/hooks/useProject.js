import { useEffect, useState } from 'react';
import {
  getProject as getProjectRequest,
  setEvent as setEventRequest,
  setProject as setProjectRequest,
  addEvent as addEventRequest,
  addEventPublic,
  deleteEvent as deleteEventRequest,
  deleteTag as deleteTagRequest,
  groupProjectEvents,
} from '../../requests/projectRequests';

export default function useProject(initProject, initId) {
  const [project, setProject] = useState(initProject);
  const { id } = project || {};

  useEffect(() => {
    async function requestProject() {
      const project = await getProjectRequest(initId);

      setProject(project);
    }

    if (!project) requestProject();
  }, [initId]);

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

  async function createEvent(event, isPublic) {
    let localProject = {
      ...project,
      events: [...project.events, event],
    };
    localProject.events = localProject.events.sort((event1, event2) =>
      event1.date > event2.date ? 1 : -1
    );
    localProject = groupProjectEvents(localProject);
    setProject(localProject);

    let remoteProject;
    if (isPublic) {
      remoteProject = await addEventPublic(id, event);
    } else {
      remoteProject = await addEventRequest(id, event);
    }
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
