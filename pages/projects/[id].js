import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';
import { getProjectIds, getProject } from '../../lib/projects';

export async function getStaticPaths() {
  const paths = getProjectIds();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const project = getProject(params.id);

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
