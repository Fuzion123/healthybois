import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import { authActions } from '_store';

export { Login };

function Login() {
    const dispatch = useDispatch();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit({ username, password }) {
        return dispatch(authActions.login({ username, password }));
    }

    return (
        
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
   <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img alt='healthybois-logo' className="mx-auto h-13 w-13 " src={process.env.PUBLIC_URL + '/logo.png'} /> 
                <h4 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Login</h4>
                </div>
                
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        
                            <label className="block text-md font-medium leading-6 text-gray-900">Username</label>
                            <div class="mt-2">
                            <input name="username" type="text" {...register('username')} className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}
                            </div>
                            </div>
                        

                            <div>
                            <div class="flex items-center justify-between">
                            <label className="block text-md font-medium leading-6 text-gray-900">Password</label>
                            <div class="text-sm">
                            <a href="/" class="font-semibold text-red-300 hover:text-indigo-500">Forgot password?</a>  
                            </div>
                            </div>
                            <div class="mt-2">
                            <input name="password" type="password" {...register('password')} className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        </div>
                        <div>
                        <button disabled={isSubmitting} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-green-400">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Login
                        </button>
                        </div>
                        </form>
                        <p class="mt-10 text-center text-sm text-gray-500">
                        <Link to="../register" className="font-semibold leading-6 text-red-300 hover:text-indigo-500">Register</Link>
                        </p>
                </div>
        </div>
  

        
    )
}
