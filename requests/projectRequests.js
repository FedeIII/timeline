import { gql } from '@apollo/client';
import client from '../apollo-client';

const ProjectOutput = `
  id
  userId
  title
  description
  tags { label, type }
  events { id, imgUrl, videoUrl, title, description, date, type, topic }
  twitter { mainThreadId, subThreadId }
`;

/////////////
// HELPERS //
/////////////

function groupEvents(events = []) {
  return events.reduce((groupedEvents, currentEvent) => {
    if (currentEvent.type == 'MIDDLE') {
      const startEventIndex = groupedEvents.findIndex(
        otherEvent =>
          otherEvent.type == 'START' && otherEvent.topic == currentEvent.topic
      );

      const startEvent = groupedEvents[startEventIndex];
      startEvent.middle = startEvent.middle || [];
      startEvent.middle.push(currentEvent);
    } else if (currentEvent.type == 'END') {
      const startEventIndex = groupedEvents.findIndex(
        otherEvent =>
          otherEvent.type == 'START' && otherEvent.topic == currentEvent.topic
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

/////////////
// QUERIES //
/////////////

export async function getAllProjects(userId) {
  const { data } = await client.query({
    query: gql`
      query GetAllProjects($userId: String!) {
        getAllProjects(userId: $userId) {
          ${ProjectOutput}
        }
      }
    `,
    variables: { userId },
  });

  return data.getAllProjects;
}

export async function getAllProjectIds(userId) {
  const { data } = await client.query({
    query: gql`
      query GetAllProjects($userId: String!) {
        getAllProjects(userId: $userId) {
          id
        }
      }
    `,
    variables: { userId },
  });

  const paths = data.getAllProjects.map(project => {
    return {
      params: {
        id: project.id,
      },
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

///////////////
// MUTATIONS //
///////////////

export async function createProject(projectProps) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation CreateProject($input: ProjectInput!) {
          createProject(input: $input) {
            ${ProjectOutput}
          }
        }
      `,
      variables: { input: projectProps },
    });

    return data.createProject;
  } catch (error) {
    throw new Error(error.message);
  }
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

export async function deleteTag(projectId, tagLabel) {
  const { data } = await client.mutate({
    mutation: gql`
      mutation DeleteTag($projectId: String!, $tagLabel: String!) {
        deleteTag(projectId: $projectId, tagLabel: $tagLabel) {
          ${ProjectOutput}
        }
      }
    `,
    variables: { projectId, tagLabel },
  });

  return data.deleteTag;
}

export async function deleteProject(id) {
  const { data } = await client.mutate({
    mutation: gql`
      mutation DeleteProject($id: String!) {
        deleteProject(id: $id)
      }
    `,
    variables: { id },
  });

  return data.deleteProject;
}
