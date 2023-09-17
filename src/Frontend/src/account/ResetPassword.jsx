import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { userapi } from '_api';
import { history } from '_helpers';
import { useParams} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { alertActions } from '_store';

export { ResetPassword };

function ResetPassword() {
    const dispatch = useDispatch();
    const { code } = useParams();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        newpassword: Yup.string().required('required'),
        newpasswordconfirm: Yup.string()
        .required('required')
        .oneOf([Yup.ref('newpassword'), null], 'Passwords must match')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    const mutation = useMutation(async (data) => {

        console.log('data: ' + JSON.stringify(data));
        console.log('code: ' + code);

        if(!code || code === undefined || code === null){
            console.log("No reset password recover code was found in the URL.'")
            dispatch(alertActions.error({ message: 'No reset password recover code was found in the URL.'}));
            return;
        }

        await userapi.resetpassword(code, data)

      }, {
        onSuccess: () => {
          dispatch(alertActions.success({ message: 'Your password has been reset.', showAfterRedirect: true }));
          history.navigate('/account/login');
        },
        onError: (error, variables, context) => {
            // An error happened!
            dispatch(alertActions.error({ message: error }));
          },
      });

    function onSubmit({ newpasswordconfirm, newpassword }) {

        var data = {
            newPassword: newpassword,
            newpasswordconfirm: newpasswordconfirm
        }

        return mutation.mutate(data);
    }

    return (
        
  <div className="flex min-h-full flex-col justify-center px-10 py-14 lg:px-8">
   <div className="sm:mx-auto sm:w-full sm:max-w-sm">
   <img alt='healthybois-logo' className="mx-auto h-25 w-25 filter drop-shadow-2xl" src={process.env.PUBLIC_URL + '/logo.png'} />
                <h4 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Reset your password</h4>
                </div>
                
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        
                            <label className="block text-md font-medium leading-6 text-gray-900">New password</label>
                            <div className="mt-2">
                            <input name="newpassword" type="password" {...register('newpassword')} className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.newpassword ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.newpassword?.message}
                            </div>
                            </div>

                            <label className="block text-md font-medium leading-6 text-gray-900">Confirm new password</label>
                            <div className="mt-2">
                            <input name="newpasswordconfirm" type="password" {...register('newpasswordconfirm')} className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.newpasswordconfirm ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.newpasswordconfirm?.message}
                            </div>
                            </div>
                        <div>
                        <button disabled={mutation.isLoading} className="flex btn-primary w-full justify-center">
                            {mutation.isLoading ? (
                                <>
                                    <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="font-medium">Resetting...</span>
                                </>
                            ) : (
                                'Reset'
                            )}
                        </button>
                        <button onClick={() => history.navigate(`/login`)} className="btn-negative w-full">Back</button>
                        </div>
                        </form>
                </div>
        </div>
  

        
    )
}
