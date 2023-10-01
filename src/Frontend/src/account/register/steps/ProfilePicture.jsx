export { ProfilePicture };

// const imageMimeType = /image\/(png|jpg|jpeg)/i;

// const validationSchema = Yup.object().shape({
//   firstName: Yup.string().required("First Name is required"),
//   lastName: Yup.string().required("Last Name is required"),
//   email: Yup.string().email().required("Email is required"),
//   username: Yup.string().required("Username is required"),
//   password: Yup.string()
//     .required("Password is required")
//     .min(6, "Password must be at least 6 characters"),
//   picture: Yup.mixed()
//     .required("Profile picture is required")
//     .test("fileSize", "Profile picture is too large", (value) => {
//       return value && value.size <= 20000000; // maximum file size of 20 MB
//     })
//     .test("fileType", "Unsupported file format", (value) => {
//       return (
//         value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
//       );
//     }),
// });

// const toBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = reject;
//   });

function ProfilePicture() {
  //   const [file, setFile] = useState(null);
  //   const [fileDataURL, setFileDataURL] = useState(null);

  //   const formOptions = { resolver: yupResolver(validationSchema) };
  //   const { register, handleSubmit, formState, setValue } = useForm(formOptions);

  //   const changeHandler = (e) => {
  //     const file = e.target.files[0];
  //     setValue("picture", file);
  //     if (!file.type.match(imageMimeType)) {
  //       alert("Image mime type is not valid");
  //       return;
  //     }
  //     setFile(file);
  //   };
  //   useEffect(() => {
  //     let fileReader,
  //       isCancel = false;
  //     if (file) {
  //       fileReader = new FileReader();
  //       fileReader.onload = (e) => {
  //         const { result } = e.target;
  //         if (result && !isCancel) {
  //           setFileDataURL(result);
  //         }
  //       };
  //       fileReader.readAsDataURL(file);
  //     }
  //     return () => {
  //       isCancel = true;
  //       if (fileReader && fileReader.readyState === 1) {
  //         fileReader.abort();
  //       }
  //     };
  //   }, [file]);

  return (
    <div>
      <h1 class="mb-3 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
        Yolo
      </h1>
      <label className="block text-md font-medium leading-6 text-gray-900">
        Add a profile picture
      </label>
      <div className="flex items-center justify-center w-full mt-4">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG or JPG
            </p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" />
        </label>

        {/* <img
          className="rounded-full w-96 h-96"
          src="/docs/images/examples/image-4@2x.jpg"
          alt="image description"
        ></img> */}
      </div>
    </div>
  );
}
