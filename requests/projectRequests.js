import { gql } from "@apollo/client";
import client from "../apollo-client";

export async function getAllProjects() {
  const { data } = await client.query({
    query: gql`
      query GetAllProjects {
        getAllProjects {
          id
          title
          date
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
          id
          title
          date
          description
          tags { label, type }
          events { id, imgUrl, title, description, date, type, topic }
        }
      }
    `,
    variables: { id },
  });

  return data.getProject;
}

export async function setProject(id, projectProps) {
  const { data } = await client.mutate({
    mutation: gql`
      mutation EditProject($id: String!, $input: ProjectInput!) {
        editProject(id: $id, input: $input) {
          id
          title
          date
          description
          tags { label, type }
          events { id, imgUrl, title, description, date, type, topic }
        }
      }
    `,
    variables: { id, input: projectProps },
  });

  return data;
}

export async function setEvent(projectId, eventId, eventProps) {
  const { data } = await client.mutate({
    mutation: gql`
      mutation EditEvent($projectId: String!, $eventId: String!, $eventProps: EventInput!) {
        editEvent(projectId: $projectId, eventId: $eventId, eventProps: $eventProps) {
          id
          title
          date
          description
          tags { label, type }
          events { id, imgUrl, title, description, date, type, topic }
        }
      }
    `,
    variables: { projectId, eventId, eventProps },
  });

  return data;
}

export async function addEvent(projectId, event) {
  const { data } = await client.mutate({
    mutation: gql`
      mutation AddEvent($projectId: String!, $event: EventInput!) {
        addEvent(projectId: $projectId, event: $event) {
          id
        }
      }
    `,
    variables: { projectId, event },
  });

  return data;
}