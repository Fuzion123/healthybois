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
import { Header } from "_components/Header";
import { useQueryClient } from "react-query";

export default AddActivity;

function AddActivity() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // form validation rules
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const [isLoading, setIsLoading] = useState(false);
  const { errors } = formState;

  const mutation = useMutation(
    async (data) => {
      setIsLoading(true);
      var response = await activityapi.create(id, data);
      setIsLoading(false);
      queryClient.invalidateQueries({
        queryKey: [`/getById/${id}`],
      });
      history.navigate(`events/${id}/${response.id}`);
    },
    {
      onError: (error) => {
        setIsLoading(false);
        dispatch(alertActions.clear());
        dispatch(alertActions.error(error));
      },
    }
  );

  async function submit(data) {
    await mutation.mutate(data);
  }

  return (
    <div className="flex flex-col sm:mx-auto sm:w-full sm:max-w-lg mt-2 mb-2">
      <Header
        className="flex flex-row justify-between text-base/6"
        title="Add new activity"
      ></Header>
      <form onSubmit={handleSubmit(submit)} className="mt-10 space-y-6">
        <div>
          <label className="block text-md font-medium leading-6 text-gray-900">
            Title
          </label>
          <div className="mt-2">
            <input
              name="title"
              type="text"
              autoFocus={true}
              {...register("title")}
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                errors.title ? "is-invalid" : ""
              }`}
            />
            <div className="invalid-feedback">{errors.title?.message}</div>
          </div>
        </div>
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
      </form>
    </div>
  );
}
