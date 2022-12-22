import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    // uri: 'http://localhost:8080/graphql',
    uri: 'https://timeline-service.herokuapp.com/graphql',
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache(),
});

export default client;
