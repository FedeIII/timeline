import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    // uri: 'http://127.0.0.1:8080/graphql',
    uri: 'https://timeline-service.herokuapp.com/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});

export default client;
