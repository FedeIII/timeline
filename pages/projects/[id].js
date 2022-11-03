import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';

export async function getServerSideProps({ params }) {
  let project;

  try {
    const response = await fetch(`http://localhost:8080/projects/${params.id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    project = await response.json();
  } catch (error) {
    console.log(error);
    project = {};
  }

  return {
    props: project,
  };
}

export default function Post(props) {
  const { id, title, date } = props;
  console.log('props', props);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <h2>id: {id}</h2>
      <h2>date: {date}</h2>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </Layout>
  )
}
