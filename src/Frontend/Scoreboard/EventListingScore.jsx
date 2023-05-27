import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { history } from '_helpers';
import { eventsActions, alertActions } from '_store';

export default  AddEdit;

function AddEdit() {
    const [title, setTitle] = useState();
    const dispatch = useDispatch();
    const event = useSelector(x => x.users?.item);

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        // endDate: Yup.date().required('End Date is required'),
      });

    
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        setTitle('Add event');
    }, []);

    async function onSubmit(data) {

        if(startDate === undefined || startDate === null){
            dispatch(alertActions.error('Your event needs an Start date'));

            return;
        }

        if(endDate === undefined || endDate === null){
            dispatch(alertActions.error('Your event needs an End date'));

            return;
        }
    
        dispatch(alertActions.clear());
        try {
          let message = "event added";
          await dispatch(
            eventsActions.create({
              data: {
                title: data.title,
                startsAt: startDate.toISOString(),
                endsAt: endDate.toISOString()
              },
            })
          ).unwrap();
          history.navigate('/events');
          dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } catch (error) {
          dispatch(alertActions.error(error));
        }
      }

    return (
        <>
            <h1>{title}</h1>
            {!(event?.loading || event?.error) &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                    <div className="">
                            <label>Title</label>
                            <input name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.title?.message}</div>
                            </div>
                        <div className="mb-3 col">
                            <label>Start Date</label>
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                showTimeSelect
                                name="startDate"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                            />
                            <div className="invalid-feedback">{errors.startDate?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label>End Date</label>
                            <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                            />
                            <div className="invalid-feedback">{errors.endDate?.message}</div>
                        </div>
                        </div>
                        <div className="mb-3">
                        <button type="submit" disabled={isSubmitting} className="mr-4 rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Create
                        </button>
                        <button onClick={() => reset()} type="button" disabled={isSubmitting} className="mr-4 rounded-md bg-blue-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Reset</button>
                        <Link to="/events" className="rounded-md bg-red-400 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Cancel</Link>
                    </div>
                </form>
            }
            {event?.loading &&
                <div className="text-center m-5">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            {event?.error &&
                <div class="text-center m-5">
                    <div class="text-danger">Error loading user: {event.error}</div>
                </div>
            }
        </>
    );
}
