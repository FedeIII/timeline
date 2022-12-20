import format from 'date-fns/format';
import { useState } from 'react';
import eventCardStyles from '../../components/eventCard.module.scss';
import projectImageStyles from '../../components/projectImage.module.scss';
import styles from './create-project.module.scss';

function textareaCallback(textareaNode) {
  textareaNode.target.style.height = '';
  textareaNode.target.style.height = textareaNode.target.scrollHeight + 'px';
}

function Media(props) {
  const { title, videoUrl, imgUrl } = props;

  if (videoUrl) return <ProjectVideo title={title} videoUrl={videoUrl} />;
  else if (imgUrl)
    return (
      <ProjectImage
        className={projectImageStyles.eventCardImage}
        imgUrl={imgUrl}
        alt={title}
      />
    );
}

export default function FirstEvent(props) {
  const { register } = props;

  const [media, setMedia] = useState('IMG');

  return (
    <div className={eventCardStyles.eventCard}>
      <div className={styles.firstEventMedia}>
        <select value={media} onChange={e => setMedia(e.target.value)}>
          <option value="IMG">Image</option>
          <option value="VIDEO">Video</option>
        </select>
        {media === 'IMG' ? (
          <div className={styles.mediaUrl}>
            <span className={styles.mediaUrlTag}>Image URL:</span>
            <input
              {...register('imgUrl@event')}
              className={styles.mediaUrlInput}
            />
          </div>
        ) : (
          <div className={styles.mediaUrl}>
            <span className={styles.mediaUrlTag}>Video URL:</span>
            <input
              {...register('videoUrl@event')}
              className={styles.mediaUrlInput}
            />
          </div>
        )}
      </div>
      <div className={eventCardStyles.eventCardInfo}>
        <input
          placeholder="Event title"
          {...register('title@event')}
          className={eventCardStyles.eventTitleInput}
        />
        <div className={eventCardStyles.eventCardDescriptionContainer}>
          <textarea
            onInput={textareaCallback}
            placeholder="Event description"
            {...register('description@event')}
            className={eventCardStyles.eventCardDescription}
          />
        </div>
        <input
          placeholder={format(new Date(), 'yyyy-MM-dd')}
          {...register('date@event')}
          className={eventCardStyles.eventCardDate}
        />
      </div>
    </div>
  );
}
