import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { userapi } from "_api";
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

    const [query, setQuery] = useState("");
    const [usersSearchResult, SetUsersSearchResult] = useState([]);
    const [participants, SetParticipants] = useState([]);
    
    useEffect(() => {

      async function searchUsers(term) {

        if(!term || term === null)
          return;

        let response = await userapi.searchUsers(term);
        
        var resultingSearchList = [];

        response.forEach(user => {
          
          var userAlreadyAdded = false;

          participants.forEach(p => {
            if(p.userId === user.userId){
              userAlreadyAdded = true;
              return;
            }
          })
          
          resultingSearchList.push(
            {
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              profilePictureUri: user.profilePictureUri,
              addedAlready: userAlreadyAdded  
            });
          
        });

        SetUsersSearchResult(resultingSearchList)
      };

      const timeOutId = setTimeout(() => {
        
        searchUsers(query);
        
      }, 500);
      return () => clearTimeout(timeOutId);
    }, [query]);


    function addParticipants(user){
      SetUsersSearchResult([]);
      // document.getElementById('user-search-dropdown').classList.add('hidden');
      document.getElementById('search-user-dropdown').value = ''

      setQuery('');

      if(user.addedAlready){
        SetParticipants(participants.filter(item => item.userId !== user.userId));
      }
      else{
        SetParticipants(participants => [...participants, user]);
      }
    }

    async function onSubmit(data) {

        if(startDate === undefined || startDate === null){
            dispatch(alertActions.error('Your event needs an Start date'));

            return;
        }

        if(endDate === undefined || endDate === null){
            dispatch(alertActions.error('Your event needs an End date'));

            return;
        }

        if(data.picture === undefined || data.picture === null){
            dispatch(alertActions.error('Please choose an event picture'));
            return;
        }

        dispatch(alertActions.clear());

        try {

          var imageAsBase64 = await toBase64(data.picture);

          var users = participants.map(p => {
            return {userId: p.userId}
          });

          const message = "event created";

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
                participants: users
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
                            <label className='mb-3'>Event picture</label>
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
                                autoComplete='off'
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
                            autoComplete='off'
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                            />
                            <div className="invalid-feedback">{errors.endDate?.message}</div>
                        </div>
                        
                        <div className="mb-4">
                          <h2>Add participants</h2>
                          <div className="flex">                          
                            <div className="relative w-full">
                                <input onChange={event => setQuery(event.target.value)} type="search" id="search-user-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="insert name" />
                                <button disabled className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                    <span className="sr-only">Search</span>
                                </button>
                            </div>
                          </div>
                          {(usersSearchResult && usersSearchResult.length > 0) && 
                            <div id="user-search-dropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                              {usersSearchResult.map((p, index) => (
                                <li key={index}>
                                  <div className='flex flex-row'>
                                    <button onClick={() => addParticipants(p)} type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{p.firstName} {p.lastName} {p.addedAlready ? ' - added already' : ''}</button>
                                  </div>
                                </li>
                              ))}
                              </ul>
                          </div>
                          }
                          <div className="mb-4">
                          {(participants && participants.length > 0) && 
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                            {participants.map((p, index) => (
                              <li key={index}>
                                <div>{p.firstName} {p.lastName}</div>
                              </li>
                            ))}
                            </ul>
                          }
                          </div>
                          
                        </div>
                        </div>
                        <div className="mb-3">
                        <button type="submit" disabled={isSubmitting} className="mr-2 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Create
                        </button>
                        <button onClick={() => reset()} type="button" disabled={isSubmitting} className="mr-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Reset</button>
                        <Link to="/events" className="mr-2 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Cancel</Link>
                    </div>
                </form>
            }
            {event?.loading &&
                <div className="text-center m-5">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            {event?.error &&
                <div className="text-center m-5">
                    <div className="text-danger">Error loading user: {event.error}</div>
                </div>
            }
        </>
    );
}
