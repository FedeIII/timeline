export default function ProjectVideo(props) {
  const { className, title, videoUrl, videoWidth, videoHeight } = props;

  const width = videoWidth || '560';
  const height = videoHeight || '315';

  return (
    <div className={className}>
      <iframe
        width={width}
        height={height}
        src={videoUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
