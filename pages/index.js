import Head from 'next/head';
import { useContext } from 'react';

import Layout, { siteTitle } from '../components/layout';
import UserContext from '../contexts/userContext';
import { TwitterIntegration } from '../components/integrations/twitterIntegration';
import styles from './index.module.scss';
import { getAllProjects } from '../requests/projectRequests';
import Link from 'next/link';
import { getUser } from '../requests/userRequests';

export async function getServerSideProps(context) {
  let projects;
  try {
    const user = await getUser(context.req.cookies);
    projects = await getAllProjects(user.id);
  } catch (error) {
    console.log('Error getting projects', error);
    projects = [];
  }

  return {
    props: { projects },
  };
}

export default function Home(props) {
  const { projects } = props;

  const userContext = useContext(UserContext) || [];
  const [user] = userContext;

  if (!user) return;

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className={styles.header}>
        <h2 className={styles.title}>{user.name}'s Profile</h2>
      </div>
      <div className={styles.content}>
        <section className={styles.projects}>
          <h3 className={styles.sectionTitle}>Projects</h3>
          <ul className={styles.projectList}>
            {projects.map(project => (
              <li className={styles.project} key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className={styles.projectLink}
                >
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.integrations}>
          <h3 className={styles.sectionTitle}>Integrations</h3>
          <div className={styles.integrationsContainer}>
            <TwitterIntegration />
          </div>
        </section>
      </div>
    </Layout>
  );
}
