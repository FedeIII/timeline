import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import Layout, { siteTitle } from '../../components/layout';
import { createProject } from '../../requests/projectRequests';
import styles from './create-project.module.scss';
import FirstEvent from './firstEvent';
import Header from './header';

function toSnakeCase(title) {
  return title
    .split('')
    .map(c => {
      if (c === ' ') return '-';
      return c.toLowerCase();
    })
    .join('');
}

const noOp = () => {};

export default function CreateProject() {
  const useFormProps = useRef({ handleSubmi: noOp, register: noOp });
  useEffect(() => {
    useFormProps.current = useForm();
  }, []);
  const { handleSubmi, register } = useFormProps.current;

  const submit = handleSubmit(data => {
    if (!data.title) return;

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
    createProject(project);
  });

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <form>
        <section className={styles.headerSection}>
          <Header register={register} />
        </section>
        <section className={styles.firstEvent}>
          <h2>First Event</h2>
          <FirstEvent register={register} />
        </section>
        <div className={styles.buttons}>
          <button className={styles.createButton} onClick={submit}>
            Create project
          </button>
        </div>
      </form>
    </Layout>
  );
}
