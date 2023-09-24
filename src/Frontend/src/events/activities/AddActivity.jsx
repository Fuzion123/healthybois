import { history } from "_helpers";
import { activityapi } from "_api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { alertActions } from "_store";
import { useDispatch } from "react-redux";
// import { useState } from 'react';

export default AddActivity;

function AddActivity(props) {
  const { id } = useParams();
  const dispatch = useDispatch();

  // form validation rules
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    // picture: Yup.mixed()
    // .test('fileSize', 'Profile picture is too large', (value) => {
    //   return value && value.size <= 20000000; // maximum file size of 20 MB
    // })
    // .test('fileType', 'Unsupported file format', (value) => {
    //   return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    // })
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const [isLoading, setIsLoading] = useState(false);
  const { errors } = formState;

  const mutation = useMutation(
    async (data) => {
      await activityapi.create(id, data);
    },
    {
      onSuccess: () => {
        setIsLoading(false);
        history.navigate(-1);
      },
      onError: (error) => {
        setIsLoading(false);
        dispatch(alertActions.clear());
        dispatch(alertActions.error(error));
      },
    }
  );

  async function submit(data) {
    setIsLoading(true);
    await mutation.mutate(data);
  }

  // const [selectedFileName, setSelectedFileName] = useState('');

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setValue('picture', file);

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setSelectedFileName(file.name);
  //   };
  //   reader.readAsDataURL(file);
  // };

  return (
    <div>
      <form
        onSubmit={handleSubmit(submit)}
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6"
      >
        <h1 className="block text-md font-medium leading-6 text-gray-900 text-3xl">
          Add new activity
        </h1>
        <div>
          <label className="block text-md font-medium leading-6 text-gray-900">
            Title
          </label>
          <div className="mt-2">
            <input
              name="title"
              type="text"
              {...register("title")}
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                errors.title ? "is-invalid" : ""
              }`}
            />
            <div className="invalid-feedback">{errors.title?.message}</div>
          </div>
        </div>
        {/* <div className="mt-2">
          <label className="mb-3 block text-md font-medium leading-6 text-gray-900">Activity picture</label>
          <div className="relative">
            <label htmlFor="fileInput" className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 0 1 1 1v4h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H6a1 1 0 0 1 0-2h4V4a1 1 0 0 1 1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <input
              id="fileInput"
              name="picture"
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="text-green-500 mt-2">
            {selectedFileName && <p>Selected File: {selectedFileName}</p>}
            {errors.picture?.message}
          </div>
        </div> */}
        <div className="mt-2"></div>
        <button disabled={isLoading} className="btn-primary w-full">
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1"></span>
              <span className="font-medium">Processing...</span>
            </>
          ) : (
            "Add"
          )}
        </button>
        <button
          onClick={() => history.navigate(`/events`)}
          className="btn-negative w-full"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
