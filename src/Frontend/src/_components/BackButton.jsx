import { history } from "_helpers";

export default BackButton;

function BackButton({ buttonName }) {
  return (
    <>
      <button className="btn-back" onClick={() => history.navigate(-1)}>
        {buttonName}
      </button>
    </>
  );
}
