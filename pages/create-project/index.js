import Head from 'next/head';
import Link from 'next/link';
import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';

import Layout, { siteTitle } from '../../components/layout';
import UserContext from '../../contexts/userContext';
import {
  createProject,
  createProjectPublic,
} from '../../requests/projectRequests';
import styles from './create-project.module.scss';
import FirstEvent from '../../components/create-project/firstEvent';
import Header from '../../components/create-project/header';

function toSnakeCase(title) {
  return (
    title &&
    title
      .split('')
      .map(c => {
        if (c === ' ') return '-';
        return c.toLowerCase();
      })
      .join('')
  );
}

const noOp = () => {};

function useProcessForm(setProjectCreated, setError, isPublic) {
  const userContext = useContext(UserContext);
  const [user] = userContext;

  return async function processForm(data) {
    const project = { events: [{ id: uuid() }] };
    Object.entries(data).forEach(([field, value]) => {
      if (value !== '') {
        const [fieldName, event] = field.split('@');
        if (event === 'event') {
          project.events[0][fieldName] = value;
        } else {
          project[fieldName] = value;
        }
      }
    });

    project.id = toSnakeCase(project.title);

    console.log('submitting', project);
    try {
      let createdProject;
      if (isPublic) {
        createdProject = await createProjectPublic({
          ...project,
          userId: user.id,
        });
      } else {
        createdProject = await createProject({
          ...project,
          userId: user.id,
        });
      }
      setProjectCreated(createdProject);
      setError(null);
    } catch (error) {
      setProjectCreated(null);
      setError(error.message);
    }
  };
}

function ProjectCreated(props) {
  const { project } = props;

  return (
    <section className={styles.projectCreated}>
      <div className={styles.projectCreatedTitle}>
        Project "{project.title}" created
      </div>
      <div className={styles.actions}>
        <Link href={`/projects/${project.id}`} className={styles.actionButton}>
          {project.title} timeline
        </Link>
        <Link href="/projects" className={styles.actionButton}>
          All timelines
        </Link>
      </div>
    </section>
  );
}

function CreateProjectMenu(props) {
  const { register, control, error, submitWithTweet, submitWithoutTweet } =
    props;

  return (
    <form>
      <section className={styles.headerSection}>
        <Header register={register} control={control} />
      </section>
      <section className={styles.firstEvent}>
        <h2>First Event</h2>
        <FirstEvent register={register} />
      </section>
      {error && <section className={styles.errors}>{error}</section>}
      <div className={styles.buttons}>
        <button className={styles.createButton} onClick={submitWithTweet}>
          Create project and Tweet
        </button>
        <button className={styles.createButton} onClick={submitWithoutTweet}>
          Create project
        </button>
      </div>
    </form>
  );
}

export default function CreateProject() {
  const useFormProps = useRef(useForm());
  const {
    handleSubmit = noOp,
    register = noOp,
    control = noOp,
  } = useFormProps.current;

  const [projectCreated, setProjectCreated] = useState(null);
  const [error, setError] = useState(null);

  const submitWithTweet = handleSubmit(
    useProcessForm(setProjectCreated, setError, true)
  );
  const submitWithoutTweet = handleSubmit(
    useProcessForm(setProjectCreated, setError, false)
  );

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {projectCreated ? (
        <ProjectCreated project={projectCreated} />
      ) : (
        <CreateProjectMenu
          register={register}
          control={control}
          error={error}
          submitWithTweet={submitWithTweet}
          submitWithoutTweet={submitWithoutTweet}
        />
      )}
    </Layout>
  );
}
