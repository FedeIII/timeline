import { useCallback, useContext, useState } from 'react';

import styles from './calendar.module.scss';
import ProjectContext from '../../contexts/projectContext';
import { ProjectImage } from '../projectImage';
import { ProjectVideo } from '../projectVideo';

const noOp = () => {};

function Media(props) {
  const { event } = props;
  const { videoUrl } = event;

  if (videoUrl)
    return (
      <ProjectVideo
        className={styles.calendarMedia}
        videoWidth="100%"
        videoHeight="100%"
        {...event}
      />
    );
  else return <ImageInput {...props} />;
}

function ImageInput(props) {
  const { event, register, media, setMedia } = props;
  const { title, id, imgUrl } = event;

  if (imgUrl)
    return (
      <ProjectImage
        className={styles.calendarMedia}
        imgUrl={imgUrl}
        alt={title}
      />
    );

  return (
    <div className={styles.noImage}>
      <select
        className={styles.mediaSelect}
        value={media}
        onChange={e => setMedia(e.target.value)}
      >
        <option value="IMG">Image</option>
        <option value="VIDEO">Video</option>
      </select>
      {media === 'IMG' ? (
        <>
          <span className={styles.imgUrlTag}>Image URL:</span>
          <input {...register(`${id}#imgUrl`)} className={styles.imgUrlInput} />
        </>
      ) : (
        <>
          <span className={styles.imgUrlTag}>Video URL:</span>
          <input
            {...register(`${id}#videoUrl`)}
            className={styles.imgUrlInput}
          />
        </>
      )}
    </div>
  );
}

function MiddleRow(props) {
  const {
    disabled,
    isEditMode,
    register,
    id,
    description,
    imgUrl,
    videoUrl,
    _local,
    setInputValues,
    inputValues,
  } = props;

  const [isMediaSelected, setIsMediaSelected] = useState(
    !!(imgUrl || videoUrl)
  );

  const [media, setMedia] = useState('IMG');

  let className = styles.middleRow;
  if (isMediaSelected) className += ' ' + styles.mediaSelected;

  if (_local)
    return (
      <div className={className}>
        <div className={styles.noImage}>
          <select
            className={styles.mediaSelect}
            value={media}
            onChange={e => setMedia(e.target.value)}
          >
            <option value="IMG">Image</option>
            <option value="VIDEO">Video</option>
          </select>
          {media === 'IMG' ? (
            <>
              <span className={styles.imgUrlTag}>Image URL:</span>
              <input
                value={inputValues.imgUrl}
                onChange={e =>
                  setInputValues({ ...inputValues, imgUrl: e.target.value })
                }
                className={styles.imgUrlInput}
              />
            </>
          ) : (
            <>
              <span className={styles.imgUrlTag}>Video URL:</span>
              <input
                value={inputValues.videoUrl}
                onChange={e =>
                  setInputValues({ ...inputValues, videoUrl: e.target.value })
                }
                className={styles.imgUrlInput}
              />
            </>
          )}
        </div>
        <textarea
          value={inputValues.description}
          onChange={e =>
            setInputValues({ ...inputValues, description: e.target.value })
          }
          className={styles.eventDescription}
          onFocus={() => setIsMediaSelected(false)}
          onBlur={() => setIsMediaSelected(true)}
        />
      </div>
    );

  return (
    <div className={className}>
      <Media {...props} media={media} setMedia={setMedia} />
      <textarea
        defaultValue={description}
        {...register(`${id}#description`)}
        className={styles.eventDescription}
        disabled={disabled || !isEditMode}
        onFocus={() => setIsMediaSelected(false)}
        onBlur={() => setIsMediaSelected(true)}
      />
    </div>
  );
}

function ControlledInputs(props) {
  const { event = {}, isSelected, onCreate, onDeleteClick } = props;

  const eventAtDay = event || {};

  const { title, date, description, imgUrl, videoUrl, topic, type, _local } =
    eventAtDay;

  const [inputValues, setInputValues] = useState({
    title,
    description,
    imgUrl,
    videoUrl,
    topic,
    type,
  });

  const projectContext = useContext(ProjectContext);
  const onCreateClick = () => {
    const newEvent = {
      title: inputValues.title,
      date,
      description: inputValues.description,
      imgUrl: inputValues.imgUrl,
      videoUrl: inputValues.videoUrl,
      topic: inputValues.topic,
      type: inputValues.type,
    };
    projectContext.createEvent(newEvent);
    onCreate({ ...newEvent, _local: false });
  };

  return (
    <>
      <textarea
        value={inputValues.title}
        onChange={e =>
          setInputValues({ ...inputValues, title: e.target.value })
        }
        className={styles.eventInput}
      />

      {isSelected && (
        <>
          <div className={styles.editMenu}>
            <span onClick={onCreateClick} className={styles.createEvent}>
              ✓
            </span>
            <span onClick={onDeleteClick} className={styles.deleteEvent}>
              x
            </span>
          </div>

          <MiddleRow
            id={inputValues.id}
            description={inputValues.description}
            imgUrl={inputValues.imgUrl}
            videoUrl={inputValues.videoUrl}
            _local={_local}
            setInputValues={setInputValues}
            inputValues={inputValues}
          />

          <input
            value={inputValues.topic}
            onChange={e =>
              setInputValues({ ...inputValues, topic: e.target.value })
            }
            className={styles.topic}
          />

          <select
            value={inputValues.type}
            onChange={e =>
              setInputValues({ ...inputValues, type: e.target.value })
            }
            className={styles.type}
          >
            <option value="START_PROJECT">Start Project</option>
            <option value="PROMPT">Prompt</option>
            <option value="START">Start</option>
            <option value="MIDDLE">Middle</option>
            <option value="END">End</option>
            <option value="END_PROJECT">End Project</option>
          </select>
        </>
      )}
    </>
  );
}

function UncontrolledInputs(props) {
  const {
    event = {},
    disabled,
    isEditMode,
    isSelected,
    onDeleteClick,
    register = noOp,
  } = props;

  const eventAtDay = event || {};

  const { id, title, topic, type, description, imgUrl, videoUrl } = eventAtDay;

  return (
    <>
      {title && (
        <textarea
          defaultValue={title}
          {...register(`${id}#title`)}
          className={styles.eventInput}
          disabled={disabled || !isEditMode}
        />
      )}

      {isSelected && (
        <div className={styles.editMenu}>
          <span onClick={onDeleteClick} className={styles.deleteEvent}>
            x
          </span>
        </div>
      )}

      {isSelected && (
        <MiddleRow
          id={id}
          description={description}
          imgUrl={imgUrl}
          videoUrl={videoUrl}
          event={eventAtDay}
          register={register}
          disabled={disabled}
          isEditMode={isEditMode}
        />
      )}

      {isSelected && (
        <input
          defaultValue={topic}
          {...register(`${id}#topic`)}
          className={styles.topic}
          disabled={disabled || !isEditMode}
        />
      )}

      {isSelected && (
        <select
          {...register(`${id}#type`)}
          className={styles.type}
          defaultValue={type}
          disabled={disabled || !isEditMode}
        >
          <option value="START_PROJECT">Start Project</option>
          <option value="PROMPT">Prompt</option>
          <option value="START">Start</option>
          <option value="MIDDLE">Middle</option>
          <option value="END">End</option>
          <option value="END_PROJECT">End Project</option>
        </select>
      )}
    </>
  );
}

export function EventCell(props) {
  const { event = {}, setIsSelected, onDelete, onCreate } = props;
  const eventAtDay = event || {};
  const { id, _local } = eventAtDay;

  const projectContext = useContext(ProjectContext);

  const onDeleteClick = useCallback(() => {
    projectContext.deleteEvent(id);
    setIsSelected(false);
    onDelete();
  }, [projectContext && projectContext.deleteEvent, id, setIsSelected]);

  if (_local)
    return (
      <ControlledInputs
        {...props}
        onCreate={onCreate}
        onDeleteClick={onDeleteClick}
      />
    );
  else return <UncontrolledInputs {...props} onDeleteClick={onDeleteClick} />;
}
