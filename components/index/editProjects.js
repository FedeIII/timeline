import { deleteProject } from '../../requests/projectRequests';
import styles from './editProjects.module.scss';

export default function EditProjects(props) {
  const { projects } = props;

  return (
    <div className={styles.editProjects}>
      <span className={styles.editHeader}>Options</span>
      {projects.map(project => {
        const { id } = project;

        return (
          <div className={styles.editProject} key={id}>
            <button
              className={styles.deleteProject}
              onClick={() => deleteProject(id)}
            >
              x
            </button>
          </div>
        );
      })}
    </div>
  );
}
