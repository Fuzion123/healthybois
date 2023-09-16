import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from '_helpers';
import { userActions, alertActions } from '_store';

export { AddEdit };


function AddEdit() {
    const { id } = useParams();
    const [title, setTitle] = useState();
    const dispatch = useDispatch();
    const user = useSelector(x => x.users?.item);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            // password optional in edit mode
            .concat(id ? null : Yup.string().required('Password is required'))
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
    const { register, handleSubmit, reset, formState, setValue } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        if (id) {
            setTitle('Edit User');
            // fetch user details into redux state and 
            // populate form fields with reset()
            dispatch(userActions.getById(id)).unwrap()
                .then(user => reset(user));
        } else {
            setTitle('Add User');
        }
    }, []);

    async function onSubmit(data) {
        dispatch(alertActions.clear());
        try {
            // create or update user based on id param
            let message;
            if (id) {
                await dispatch(userActions.update({ id, data })).unwrap();
                message = 'User updated';
            } else {
                await dispatch(userActions.register(data)).unwrap();
                message = 'User added';
            }

            // redirect to user list with success message
            history.navigate('/users');
            dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error));
        }
    }

    return (
        <>
            <h1>{title}</h1>
            {!(user?.loading || user?.error) &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                    <div className="mb-3 col">
                    <label className="form-label">Profile Picture</label>
                        <input type="file" onChange={(e) => {
                            setValue('profilePicture', e.target.files[0]);
                        }} className={`form-control ${errors.profilePicture ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.profilePicture?.message}</div>
                    </div>
                        <div className="mb-3 col">
                            <label className="form-label">First Name</label>
                            <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.firstName?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">Last Name</label>
                            <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.lastName?.message}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">Username</label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">
                                Password
                                {id && <em className="ml-1">(Leave blank to keep the same password)</em>}
                            </label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <button type="submit" disabled={isSubmitting} className="btn-primary me-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Save
                        </button>
                        <button onClick={() => reset()} type="button" disabled={isSubmitting} className="btn-secondary">Reset</button>
                        <button onClick={() => history.navigate(`/users`)} className="btn-negative">Cancel</button>
                    </div>
                </form>
            }
            {user?.loading &&
                <div className="text-center m-5">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            {user?.error &&
                <div className="text-center m-5">
                    <div className="text-danger">Error loading user: {user.error}</div>
                </div>
            }
        </>
    );
}
