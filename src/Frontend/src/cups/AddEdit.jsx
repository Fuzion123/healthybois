import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from '_helpers';
import { cupsActions, alertActions } from '_store';

export { AddEdit };

function AddEdit() {
    const [title, setTitle] = useState();
    const dispatch = useDispatch();
    const cup = useSelector(x => x.users?.item);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        setTitle('Add Cup');
    }, []);

    async function onSubmit(data) {
        dispatch(alertActions.clear());
        try {
            // create or update user based on id param
            let message = "Cup added";

                console.log(data)

            await dispatch(cupsActions.create({ data })).unwrap();

            history.navigate('/cups');

            dispatch(alertActions.success({ message, showAfterRedirect: true }));

        } catch (error) {
            dispatch(alertActions.error(error));
        }
    }

    return (
        <>
            <h1>{title}</h1>
            {!(cup?.loading || cup?.error) &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="mb-3 col">
                            <input placeholder='title' name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.title?.message}</div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary me-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Create
                        </button>
                        <button onClick={() => reset()} type="button" disabled={isSubmitting} className="btn btn-secondary">Reset</button>
                        <Link to="/cups" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            }
            {cup?.loading &&
                <div className="text-center m-5">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            {cup?.error &&
                <div class="text-center m-5">
                    <div class="text-danger">Error loading user: {cup.error}</div>
                </div>
            }
        </>
    );
}
