import classNames from 'classnames';
import Image from 'next/image';

import styles from './eventCard.module.scss';
import TogglableForm from './HOCs/togglableForm';

function textareaCallback(textareaNode) {
  textareaNode.target.style.height = '';
  textareaNode.target.style.height = textareaNode.target.scrollHeight + 'px';
}

export default function EventCard(props) {
  const { id, imgUrl, title, description, date, editEvent } = props;

  const onFormEdit = data => {
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
  }

  return (
    <TogglableForm onFormEdit={onFormEdit}>
      {props => {
        const { isExitingEditMode, isEditMode, register } = props;

        const eventCardStyles = classNames({
          [styles.eventCard]: true,
          [styles.eventCardHover]: !isExitingEditMode,
        });

        return (
          <li className={eventCardStyles}>
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