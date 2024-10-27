import { history } from "_helpers";

export default BackButton;

function BackButton({
  title,
  customClassName,
  overwriteClickHandler,
  useTitleAndLogo,
}) {
  return (
    <>
      <div
        className={
          "cursor-pointer " +
          (customClassName && customClassName.length > 0 ? customClassName : "")
        }
        onClick={
          overwriteClickHandler
            ? () => overwriteClickHandler()
            : () => history.navigate(-1)
        }
      >
        {title && title.length > 0 && useTitleAndLogo === false ? (
          title
        ) : (
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-chevron-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
            {useTitleAndLogo && useTitleAndLogo === true && (
              <div>back</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
