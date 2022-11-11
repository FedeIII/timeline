import classNames from 'classnames';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, createRef, useLayoutEffect } from 'react';

import styles from './eventCard.module.scss';
import OutsideAlerter from './HOCs/outsideAlerter';

function textareaCallback(textareaNode) {
  textareaNode.target.style.height = '';
  textareaNode.target.style.height = textareaNode.target.scrollHeight + 'px';
}

export default function EventCard(props) {
  const { id, imgUrl, title, description, date, register, submit } = props;

  const [isExitingEditMode, setExitingEditMode] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  const eventCardStyles = classNames({
    [styles.eventCard]: true,
    [styles.eventCardHover]: !isExitingEditMode,
  });

  useEffect(() => {
    setEditMode(isExitingEditMode);
  }, [setEditMode, isExitingEditMode]);

  const onClickOutside = useCallback(() => {
    setExitingEditMode(false);
    submit();
  }, [setExitingEditMode]);

  const onCardClick = useCallback(() => setExitingEditMode(true), [setExitingEditMode]);

  return (
    <OutsideAlerter onClickOutside={onClickOutside} enabled={isEditMode}>
      <li className={eventCardStyles} onClick={onCardClick}>
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
            {...register(`${id}-title`)}
            className={styles.eventTitleInput}
            disabled={!isEditMode}
          />
          <div className={styles.eventCardDescriptionContainer}>
            <textarea
              onInput={textareaCallback}
              defaultValue={description}
              {...register(`${id}-description`)}
              className={styles.eventCardDescription}
              disabled={!isEditMode}
            />
          </div>
          <input
            defaultValue={date}
            {...register(`${id}-date`)}
            className={styles.eventCardDate}
            disabled={!isEditMode}
          />
        </div>
      </li>
    </OutsideAlerter>
  );
}