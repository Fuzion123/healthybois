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

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

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
    const { register, handleSubmit, reset, formState, setValue } = useForm(formOptions);
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

        console.log(data)

        
       
    
        dispatch(alertActions.clear());
        try {
        var imageAsBase64 = await toBase64(data.picture);
          let message = "event added";
          await dispatch(
            eventsActions.create({
              data: {
                title: data.title,
                startsAt: startDate.toISOString(),
                endsAt: endDate.toISOString(),
                description: data.description,
                picture: {
                    name: data.picture.name,
                    base64: imageAsBase64
                  },
              },
            })
          ).unwrap();
          history.navigate('/events');
          dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } catch (error) {
          dispatch(alertActions.error(error));
        }
      }
      const [selectedFileName, setSelectedFileName] = useState('');
  
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        setValue('picture', file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFileName(file.name);
        };
        reader.readAsDataURL(file);
      };
    return (
        <>
            <h1 className="mb-8 text-4xl font-bold flex justify-center items-center">{title}</h1>
            {!(event?.loading || event?.error) &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                    <div className="mb-8">
                            <label>Title</label>
                            <input name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.title?.message}</div>
                            </div>
                            <div className="mb-4">
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
      </div> </div>                             
                          <div className="mb-4">
                            <label>Description</label>
                            <input name="description" type="text" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.description?.message}</div>
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
