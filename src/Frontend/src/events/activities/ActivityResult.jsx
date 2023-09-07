// import { useForm } from "react-hook-form";
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';
import { useMutation, useQueryClient  } from "react-query";
import { resultapi } from "_api";
import { useState } from "react";
// import '../../index.css';

export default ActivityResult;

function ActivityResult(props) {

  const { participant, eventId, activityId, result } = props;
  const queryClient = useQueryClient();

  const [score, setScore] = useState(() => {
    if(result !== null)
      return result.score;
    
      return 0;
    });

  // // form validation rules 
  // const validationSchema = Yup.object().shape({
  //   score: Yup.number('Score needs to be a number')
  //     .required('Put in a score')

  // });

  // const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  // const { register, handleSubmit, formState } = useForm(formOptions);
  // const { errors, isSubmitting } = formState;

  const mutation = useMutation(async (data) => {

    console.log(data)

    var request = {
      participantId: data.participantId,
      score: data.score
    }

    resultapi.AddOrUpdateResult(eventId, activityId, request)
  }, {
    onSuccess: () => {
      console.log('invalidating')
      queryClient.invalidateQueries({ queryKey: [`/activityapi.getById/${eventId}/${activityId}`] })
    }
  });

  function decrease(){
    if(score === 0)
      return;

    scoreChanged(score-1);
  }

  function increase(){
    scoreChanged(score+1);
  }

  function scoreChanged(val){
    if(val < 0)
      return;

    mutation.mutate({
      participantId: participant.id,
      score: val
    })

    setScore(val)
  }

  return (
      
    <div>
      
      <label htmlFor="score" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">score</label>
      <div className="flex-row justify-items-center">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
              <img
                  src={participant.profilePictureUrl}
                  alt={participant.firstName}
                  className="object-cover w-full h-full"
              />
            </div>
          
            <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
              <button onClick={() => decrease()} className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                  <span className="m-auto text-2xl font-thin">−</span>
              </button>


              <input type="number" onChange={(e) => scoreChanged(e.target.value)} value={score} className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" name="custom-input-number"></input>
              
              <button onClick={() => increase()} className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                  <span className="m-auto text-2xl font-thin">+</span>
              </button>
          </div>

          {/* <div className="invalid-feedback">{errors.score?.message}</div> */}

        </div>

    </div>
  );

}