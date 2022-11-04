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
        }
      }
    `,
    variables: { id },
  });

  return data.getProject;
}
