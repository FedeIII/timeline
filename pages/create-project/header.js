import projectHeaderStyles from '../../components/projectHeader.module.scss';
// import { EditableTags } from '../../components/tags';

function textareaCallback(textareaNode) {
  textareaNode.target.style.height = '';
  textareaNode.target.style.height = textareaNode.target.scrollHeight + 'px';
}

export default function Header(props) {
  const { register } = props;

  return (
    <div className={projectHeaderStyles.projectHeader}>
      <input
        placeholder="Title"
        {...register('title')}
        className={projectHeaderStyles.title}
      />
      <div className={projectHeaderStyles.info}>
        <div className={projectHeaderStyles.descriptionContainer}>
          <textarea
            onInput={textareaCallback}
            placeholder="Description"
            {...register('description')}
            className={projectHeaderStyles.description}
          />
        </div>
        <div className={projectHeaderStyles.otherInfo}>
          {/* <EditableTags tags={tags} register={register} /> */}
        </div>
      </div>
    </div>
  );
}
