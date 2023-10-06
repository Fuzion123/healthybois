import { useEffect } from "react";

export { ProfilePicture };

const imageMimeType = /image\/(png|jpg|jpeg)/i;

function ProfilePicture({
  profilePictureUrl,
  updateFields,
  profilePictureFile,
  customValidationError,
  customValidationValidated,
}) {
  const changeHandler = (e) => {
    const localFile = e.target.files[0];

    if (!localFile.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }

    customValidationValidated = true;

    updateFields({ profilePictureFile: localFile });
  };

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (profilePictureFile) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          updateFields({ profilePictureUrl: result });
        }
      };
      fileReader.readAsDataURL(profilePictureFile);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [profilePictureFile]);

  function onEdit() {
    document.getElementById("dropzone-file").click();
  }

  return (
    <div className="">
      <h1 className="mb-3 text-1xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
        Your profile picture
      </h1>
      <div className="flex flex-col items-center justify-center w-full mt-2">
        <label
          htmlFor="dropzone-file"
          className={
            profilePictureUrl
              ? "flex items-center"
              : "flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          }
        >
          {profilePictureUrl ? (
            <div>
              <img
                className="rounded-full w-80 h-80"
                src={profilePictureUrl}
                alt="description"
              ></img>
              <button
                type="button"
                className="flex items-center btn color-bg-default rounded-2 color-fg-default border"
                onClick={onEdit}
              >
                <svg
                  aria-hidden="true"
                  height="16"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="16"
                  data-view-component="true"
                  className="octicon octicon-pencil mr-2"
                >
                  <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"></path>
                </svg>
                <p>Edit</p>
              </button>
            </div>
          ) : (
            <div>
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG or JPG
                </p>
              </div>
            </div>
          )}
          <input
            name="profile picture"
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={changeHandler}
          />
        </label>
      </div>
    </div>
  );
}
