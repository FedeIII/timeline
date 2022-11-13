import { useCallback } from 'react';

import TogglableForm from './HOCs/togglableForm';
import styles from './projectHeader.module.scss';
import { EditableTags, Tags } from './tags';

function textareaCallback(textareaNode) {
  textareaNode.target.style.height = '';
  textareaNode.target.style.height = textareaNode.target.scrollHeight + 'px';
}

export default function ProjectHeader(props) {
  const { id, title, description, date, tags, editProject } = props;

  const onFormEdit = useCallback(data => {
    let updateData = {};

    Object.entries(data).forEach(([fieldName, fieldValue]) => {
      if (typeof fieldValue !== 'undefined') {
        if (fieldName.indexOf('tag') === 0) {
          const tagIndex = fieldName.split('-')[1];
          updateData.tags = updateData.tags || tags;
          updateData.tags[tagIndex].label = fieldValue;
        } else {
          updateData[fieldName] = fieldValue;
        }
      }
    });

    console.log('submitting', id, updateData);

    if (Object.keys(updateData).length > 0) {
      editProject(id, updateData);
    }
  });

  return (
    <TogglableForm onFormEdit={onFormEdit} className={styles.projectHeader}>
      {props => {
        const { topLevelStyles, isEditMode, register } = props;

        return (
          <div className={topLevelStyles}>
            <input
              defaultValue={title}
              {...register('title')}
              className={styles.title}
              disabled={!isEditMode}
            />
            <div className={styles.info}>
              <div className={styles.descriptionContainer}>
                <textarea
                  onInput={textareaCallback}
                  defaultValue={description}
                  {...register('description')}
                  className={styles.description}
                  disabled={!isEditMode}
                />
              </div>
              <div className={styles.otherInfo}>
                <input
                  defaultValue={date}
                  {...register('date')}
                  className={styles.date}
                  disabled={!isEditMode}
                />
                {isEditMode ?
                  <EditableTags tags={tags} register={register} />
                  :
                  <Tags tags={tags} />  
                }
              </div>
            </div>
          </div>
        );
      }}
    </TogglableForm>
  );
}