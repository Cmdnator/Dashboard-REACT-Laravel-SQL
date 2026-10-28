
function JobApplicationCard({
  company,
  position,
  status,
  onChangeStatus,
  onDelete,
}) {
  return (
    <article className="application-card">
      <h3>{company}</h3>
      <p>{position}</p>
      <p>Status: {status}</p>

      <button onClick={onChangeStatus}>
        Change status
      </button>

      <button onClick={onDelete}>
        Delete
      </button>
    </article>
  );
}

export default JobApplicationCard;
