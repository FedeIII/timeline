import Image from 'next/image';
import { useCallback, useContext } from 'react';
import ProjectContext from '../contexts/projectContext';

import styles from './eventCard.module.scss';
import TogglableForm from './HOCs/togglableForm';

function textareaCallback(textareaNode) {
  textareaNode.target.style.height = '';
  textareaNode.target.style.height = textareaNode.target.scrollHeight + 'px';
}

export default function EventCard(props) {
  const { id, imgUrl, title, description, date } = props;

  const { editEvent, deleteEvent } = useContext(ProjectContext);

  const onFormEdit = useCallback(data => {
    let updateData = {};

    Object.entries(data).forEach(([fieldName, fieldValue]) => {
      if (typeof fieldValue !== 'undefined') {
        updateData[fieldName] = fieldValue;
      }
    });

    console.log('submitting', id, updateData);

    if (Object.keys(updateData).length > 0) {
      editEvent(id, updateData);
    }
  }, [id, editEvent]);

  const onDeleteClick = useCallback(() => deleteEvent(id), []);

  return (
    <TogglableForm onFormEdit={onFormEdit} className={styles.eventCard}>
      {props => {
        const { topLevelStyles, isEditMode, register } = props;

        return (
          <li className={topLevelStyles}>
            {isEditMode && <span onClick={onDeleteClick} className={styles.deleteEvent}>x</span>}
            {imgUrl && <Image
              priority
              src={imgUrl}
              className={styles.eventCardImage}
              height={256}
              width={256}
              alt={title}
            />}
            <div className={styles.eventCardInfo}>
              <input
                defaultValue={title}
                {...register('title')}
                className={styles.eventTitleInput}
                disabled={!isEditMode}
              />
              <div className={styles.eventCardDescriptionContainer}>
                <textarea
                  onInput={textareaCallback}
                  defaultValue={description}
                  {...register('description')}
                  className={styles.eventCardDescription}
                  disabled={!isEditMode}
                />
              </div>
              <input
                defaultValue={date}
                {...register('date')}
                className={styles.eventCardDate}
                disabled={!isEditMode}
              />
            </div>
          </li>
        );
      }}
    </TogglableForm>
  );
}