import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import { history } from '_helpers';
import { userActions, alertActions } from '_store';

export { Register };

function Register() {
    const dispatch = useDispatch();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
            profilePicture: Yup.mixed()
            .required('Profile picture is required')
            .test('fileSize', 'Profile picture is too large', (value) => {
              return value && value[0] && value[0].size <= 2000000; // maximum file size of 2 MB
            })
            .test('fileType', 'Unsupported file format', (value) => {
              return value && value[0] && ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type);
            }),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState, setValue } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    async function onSubmit(data) {
        dispatch(alertActions.clear());
        try {
            await dispatch(userActions.register(data)).unwrap();

            // redirect to login page and display success alert
            history.navigate('/account/login');
            dispatch(alertActions.success({ message: 'Registration successful', showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error));
        }
    }

    return (
       
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h4 class="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Register</h4>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <div class="mt-2">
            <label class="block text-md font-medium leading-6 text-gray-900">Profile Picture</label>
            <div class="mt-2">
              <input type="file" onChange={(e) => setValue('profilePicture', e.target.files[0])} class={` ${errors.profilePicture ? 'is-invalid' : ''}`} />
              <div class="invalid-feedback">{errors.profilePicture?.message}</div>
            </div>
          </div>
          <div>
            <label class="block text-md font-medium leading-6 text-gray-900">First Name</label>
            <div class="mt-2">
              <input name="firstName" type="text" {...register('firstName')} class={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.firstName ? 'is-invalid' : ''}`} />
              <div class="invalid-feedback">{errors.firstName?.message}</div>
            </div>
          </div>
          <div>
            <label class="block text-md font-medium leading-6 text-gray-900">Last Name</label>
            <div class="mt-2">
              <input name="lastName" type="text" {...register('lastName')} class={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.lastName ? 'is-invalid' : ''}`} />
              <div class="invalid-feedback">{errors.lastName?.message}</div>
            </div>
          </div>

          <div>
            <label class="block text-md font-medium leading-6 text-gray-900">Username</label>
            <div class="mt-2">
              <input name="username" type="text" {...register('username')} class={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.username ? 'is-invalid' : ''}`} />
              <div class="invalid-feedback">{errors.username?.message}</div>
            </div>
          </div>
          <div>
                    <div class="mt-2">
                        <label className="block text-md font-medium leading-6 text-gray-900">Password</label>
                        <input name="password" type="password" {...register('password')} className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.password ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password?.message}</div>
                    </div>
                    </div>
                    
                    <div class="mt-2"></div>
                    <button disabled={isSubmitting} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-green-400">
                        {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                        Register
                    </button>
                    <Link to="../login" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-red-400">Cancel</Link>
                </form>
            </div>
        
    )
}
