import { useContext, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import ProjectContext from '../contexts/projectContext';
import styles from './tags.module.scss';

export function EditableTags(props) {
  const { tags = [], control } = props;

  const { field } = useController({
    control,
    name: 'tags',
  });

  const [localTags, setLocalTags] = useState(
    tags.map(t => ({ label: t.label, type: t.type }))
  );

  function onAddTagClick() {
    setLocalTags([...localTags, { label: '', type: null }]);
  }

  const projectContext = useContext(ProjectContext);

  const width = useMemo(() => 90 / localTags.length - 1, [localTags.length]);

  return (
    <div className={styles.tagsContainer}>
      <span className={styles.addTagButton} onClick={onAddTagClick}>
        +
      </span>
      <div className={`${styles.tags} ${styles.editTags}`}>
        {localTags.map((tag, i) => {
          function onRemoveTagClick() {
            setLocalTags(localTags.slice(0, i).concat(localTags.slice(i + 1)));
            projectContext.deleteTag(tag.label);
          }

          return (
            <div
              key={i}
              className={styles.tag}
              style={{ flexBasis: `${width}%` }}
            >
              <input
                onChange={e => {
                  const newTags = [...localTags];
                  newTags[i].label = e.target.value;
                  field.onChange(newTags);
                  setLocalTags(newTags);
                }}
                value={tag.label}
                className={styles.tagInput}
              />
              <span
                className={styles.removeTagButton}
                onClick={onRemoveTagClick}
              >
                -
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Tags(props) {
  const { tags } = props;

  const width = useMemo(() => 90 / tags.length, [tags.length]);

  return (
    <div className={styles.tagsContainer}>
      <div className={styles.tags}>
        {tags.map((tag, i) => (
          <div
            key={i}
            className={styles.tag}
            style={{ flexBasis: `${width}%` }}
          >
            {tag.label}
          </div>
        ))}
      </div>
    </div>
  );
}
