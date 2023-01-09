import { useCallback, useState } from 'react';
import { deleteProject as deleteProjectRequest } from '../../requests/projectRequests';
import styles from './editProjects.module.scss';

function EditMenu(props) {
  const { id, title, deleteProject } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDeleteClick = useCallback(() => {
    deleteProject(id);
    setIsModalOpen(false);
  }, [deleteProject, id]);

  return (
    <div className={styles.editProject} key={id}>
      <button
        className={styles.deleteProject}
        onClick={() => setIsModalOpen(true)}
      >
        x
      </button>
      {isModalOpen && (
        <div className={styles.editModal}>
          Permanently delete the project "{title}"?
          <div className={styles.modalOptions}>
            <span className={styles.modalOption} onClick={onDeleteClick}>
              Delete
            </span>
            <span
              className={styles.modalOption}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditProjects(props) {
  const { projects, setProjects } = props;

  const deleteProject = useCallback(
    id => {
      deleteProjectRequest(id);
      const newProjects = projects.filter(project => project.id !== id);
      setProjects(newProjects);
    },
    [projects]
  );

  return (
    <div className={styles.editProjects}>
      <span className={styles.editHeader}>Options</span>
      {projects.map(project => (
        <EditMenu {...project} deleteProject={deleteProject} key={project.id} />
      ))}
    </div>
  );
}
