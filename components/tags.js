import styles from './tags.module.scss';

export function EditableTags(props) {
  const { tags, register } = props;

  return (
    <ul className={styles.tags}>
      {tags.map((tag, i) => (
        <input
          key={tag.label}
          defaultValue={tag.label}
          {...register(`tag-${i}`)}
          className={styles.tag}
          size={tag.label.length - Math.ceil(tag.label.length / 5)}
        />
      ))}
    </ul>
  );
}

export function Tags(props) {
  const { tags } = props;

  return (
    <ul className={styles.tags}>
      {tags.map(tag => <li key={tag.label}>{tag.label}</li>)}
    </ul>
  );
}
