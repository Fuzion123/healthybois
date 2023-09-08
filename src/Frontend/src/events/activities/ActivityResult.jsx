// import { useForm } from "react-hook-form";
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';
import { useMutation, useQueryClient  } from "react-query";
import { resultapi } from "_api";
import { useState } from "react";
// import '../../index.css';

export default ActivityResult;

function ActivityResult(props) {

  const { participant, eventId, activityId, result, isProcessing, setIsProcessing } = props;
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


  // const [isProcessing, setIsProcessing] = useState(false);

  const mutation = useMutation(async (data) => {

    console.log(data)

    var request = {
      participantId: data.participantId,
      score: data.score
    }

    await resultapi.AddOrUpdateResult(eventId, activityId, request);
  }, {
    onSuccess: () => {
      console.log('invalidating')
      queryClient.invalidateQueries({ queryKey: [`/activityapi.getById/${eventId}/${activityId}`] })
      queryClient.invalidateQueries({ queryKey: [`scoreboard/${eventId}`] })
      setIsProcessing(false);
      console.log('finishes processing')
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

    setScore(val)
    setIsProcessing(true);

    mutation.mutate({
      participantId: participant.id,
      score: val
    })

  }

  return (
      
    <div>
      <label htmlFor="score" className="mb-2 text-sm font-medium sr-only dark:text-white">score</label>
      <div className="flex flex-row justify-between items-center bg-white border rounded-lg">
            <div className="m-3">
                <div className="justify-center flex-shrink-0 w-16 h-16 rounded-full overflow-hidden">
                  <img
                      src={participant.profilePictureUrl}
                      alt={participant.firstName}
                      className="object-cover w-full h-full"/>
                </div>
                <p className="justify-center">Frederik</p>
            </div>
          
            <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent m-4">
              <button disabled={isProcessing} onClick={() => decrease()} className="bg-blue-500  text-white font-bold py-2 px-4">
                  <span className="m-auto font-thin">−</span>
              </button>
              <input disabled={true} type="number" onChange={(e) => scoreChanged(e.target.value)} value={score} className="border-blue-500 text-center w-full bg-blue-500 font-semibold text-md hover:text-white focus:text-white md:text-basecursor-default flex items-center text-white" name="custom-input-number"></input>
              <button disabled={isProcessing} onClick={() => increase()} className="bg-blue-500  text-white font-bold py-2 px-4 ">
                <span className="m-auto font-thin">+</span>
              </button>
          </div>

          {/* <div className="invalid-feedback">{errors.score?.message}</div> */}

        </div>

    </div>
  );

}