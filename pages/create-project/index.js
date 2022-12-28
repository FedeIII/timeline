import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import Layout, { siteTitle } from '../../components/layout';
import { createProject } from '../../requests/projectRequests';
import styles from './create-project.module.scss';
import FirstEvent from './firstEvent';
import Header from './header';

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

function useProcessForm(setCreatedProject, setError) {
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
      const createdProject = await createProject(project);
      setCreatedProject(createdProject.title);
      setError(null);
    } catch (error) {
      setCreatedProject(null);
      setError(error.message);
    }
  };
}

export default function CreateProject() {
  const useFormProps = useRef(useForm());
  const { handleSubmit = noOp, register = noOp } = useFormProps.current;

  const [createdProject, setCreatedProject] = useState(null);
  const [error, setError] = useState(null);

  const submit = handleSubmit(useProcessForm(setCreatedProject, setError));

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {createdProject ? (
        <section className={styles.projectCreated}>
          Project {createdProject} created
        </section>
      ) : (
        <form>
          <section className={styles.headerSection}>
            <Header register={register} />
          </section>
          <section className={styles.firstEvent}>
            <h2>First Event</h2>
            <FirstEvent register={register} />
          </section>
          {error && <section className={styles.errors}>{error}</section>}
          <div className={styles.buttons}>
            <button className={styles.createButton} onClick={submit}>
              Create project
            </button>
          </div>
        </form>
      )}
    </Layout>
  );
}
