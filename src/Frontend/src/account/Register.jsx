import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { history } from '_helpers';
import { userActions, alertActions } from '_store';
import { useState } from 'react';

export { Register };

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

function Register() {
  const dispatch = useDispatch();

  // form validation rules 
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last Name is required'),
    email: Yup.string()
      .email()
      .required('Email is required'),
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    profilePicture: Yup.mixed()
      .required('Profile picture is required')
      .test('fileSize', 'Profile picture is too large', (value) => {
        return value && value.size <= 20000000; // maximum file size of 20 MB
      })
      .test('fileType', 'Unsupported file format', (value) => {
        return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      }),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {

      var imageAsBase64 = await toBase64(data.profilePicture);

      var request = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        password: data.password,
        profilePicture: {
          name: data.profilePicture.name,
          base64: imageAsBase64
        },

      }

      await dispatch(userActions.register(request)).unwrap();

      // redirect to login page and display success alert
      history.navigate('/account/login');
      dispatch(alertActions.success({ message: 'Registration successful', showAfterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  const [chosenPicture, setChosenPicture] = useState('');

  function setProfilePictureValue(val){
    console.log(val)
    setValue('profilePicture', val)
    setChosenPicture(val.name);
  }

  return (

    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h4 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Register</h4>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        <div className="mt-2">
          <label className="mb-3 block text-md font-medium leading-6 text-gray-900">Profile Picture</label>
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
            <input id="fileInput" name="profilePicture" type="file" onChange={(e) => setProfilePictureValue(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            {chosenPicture && <span>{chosenPicture}</span>}
          </div>
        </div>
        <div>
          <label className="block text-md font-medium leading-6 text-gray-900">First Name</label>
          <div className="mt-2">
            <input name="firstName" type="text" {...register('firstName')} className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.firstName ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.firstName?.message}</div>
          </div>
        </div>
        <div>
          <label className="block text-md font-medium leading-6 text-gray-900">Last Name</label>
          <div className="mt-2">
            <input name="lastName" type="text" {...register('lastName')} className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.lastName ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.lastName?.message}</div>
          </div>
        </div>
        <div>
          <label className="block text-md font-medium leading-6 text-gray-900">Email</label>
          <div className="mt-2">
            <input name="email" type="text" {...register('email')} className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.email ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
        </div>

        <div>
          <label className="block text-md font-medium leading-6 text-gray-900">Username</label>
          <div className="mt-2">
            <input name="username" type="text" {...register('username')} className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.username ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.username?.message}</div>
          </div>
        </div>
        <div>
          <div className="mt-2">
            <label className="block text-md font-medium leading-6 text-gray-900">Password</label>
            <input name="password" type="password" {...register('password')} className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.password ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
        </div>

        <div className="mt-2"></div>
        <button className="flex w-full justify-center rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-1"></span>
              <span className="font-medium">Processing...</span>
            </>
          ) : (
            'Register'
          )}
        </button>
        <Link to="../login" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-red-400">Cancel</Link>
      </form>
    </div>

  )
}
