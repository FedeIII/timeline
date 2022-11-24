import { gql } from "@apollo/client";
import client from "../apollo-client";

const ProjectOutput = `
  id
  title
  description
  tags { label, type }
  events { id, imgUrl, title, description, date, type, topic }
`;

function groupEvents(events = []) {
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

export function groupProjectEvents(projectData) {
  let project = null;

  if (projectData) {
    project = {
      ...projectData,
      groupedEvents: groupEvents(projectData.events) || [],
    };
  }

  return project;
}

export async function getAllProjects() {
  const { data } = await client.query({
    query: gql`
      query GetAllProjects {
        getAllProjects {
          id
          title
        }
      }
    `,
  });

  return data.getAllProjects;
}

export async function getAllProjectIds() {
  const { data } = await client.query({
    query: gql`
      query GetAllProjects {
        getAllProjects {
          id
        }
      }
    `,
  });

  const paths = data.getAllProjects.map(project => {
    return {
      params: {
        id: project.id
      }
    };
  });

  return paths;
}

export async function getProject(id) {
  const { data } = await client.query({
    query: gql`
      query GetProject($id: String!) {
        getProject(id: $id) {
          ${ProjectOutput}
        }
      }
    `,
    variables: { id },
  });

  const project = groupProjectEvents(data.getProject);

  return project;
}

export async function setProject(id, projectProps) {
  const { data } = await client.mutate({
    mutation: gql`
      mutation EditProject($id: String!, $input: ProjectInput!) {
        editProject(id: $id, input: $input) {
          ${ProjectOutput}
        }
      }
    `,
    variables: { id, input: projectProps },
  });

  const project = groupProjectEvents(data.editProject);

  return project;
}

export async function setEvent(projectId, eventId, eventProps) {
  const { data } = await client.mutate({
    mutation: gql`
      mutation EditEvent($projectId: String!, $eventId: String!, $eventProps: EventInput!) {
        editEvent(projectId: $projectId, eventId: $eventId, eventProps: $eventProps) {
          ${ProjectOutput}
        }
      }
    `,
    variables: { projectId, eventId, eventProps },
  });

  const project = groupProjectEvents(data.editEvent);

  return project;
}

export async function addEvent(projectId, event) {
  const { data } = await client.mutate({
    mutation: gql`
      mutation AddEvent($projectId: String!, $event: EventInput!) {
        addEvent(projectId: $projectId, event: $event) {
          ${ProjectOutput}
        }
      }
    `,
    variables: { projectId, event },
  });

  const project = groupProjectEvents(data.addEvent);

  return project;
}

export async function deleteEvent(projectId, eventId) {
  const { data } = await client.mutate({
    mutation: gql`
      mutation DeleteEvent($projectId: String!, $eventId: String!) {
        deleteEvent(projectId: $projectId, eventId: $eventId) {
          ${ProjectOutput}
        }
      }
    `,
    variables: { projectId, eventId },
  });

  const project = groupProjectEvents(data.deleteEvent);

  return project;
}
