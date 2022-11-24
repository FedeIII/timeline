import Head from 'next/head';
import Link from 'next/link';

import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.scss';
import { getAllProjects } from '../requests/projectRequests';

export async function getStaticProps() {
  const projects = await getAllProjects();

  return {
    props: { projects },
  };
}

export default function Home(props) {
  const { projects } = props;

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        Open <Link href="/projects/project-x">Project X</Link>
      </section>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Projects</h2>
        <ul className={utilStyles.list}>
          {projects.map(({ id, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/projects/${id}`}>
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
