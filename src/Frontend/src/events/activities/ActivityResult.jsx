import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import { resultapi, participantsapi } from '_api';
import { useEffect } from 'react';

export default function ActivityResult(props) {
  const { participant, eventId, activityId } = props;
  const queryClient = useQueryClient();

  const validationSchema = Yup.object().shape({
    score: Yup.number('Score needs to be a number').required('Put in a score'),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  const mutation = useMutation(
    async (data) => {
      var request = {
        participantId: participant.id,
        score: data.score,
      };

      resultapi.AddOrUpdateResult(eventId, activityId, request);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/activityapi.getById/${eventId}`] });
      },
    }
  );

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const result = await participantsapi.getByEventId(eventId);
        console.log('Participants data:', result);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [eventId]); 

  return (
    <div>
      <form onSubmit={handleSubmit(mutation.mutate)} className="sm:mx-auto sm:w-full sm:max-w-sm">
        <label htmlFor="score" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          score
        </label>
        <div className="relative">
        <div className="mb-2 flex items-center">
  <img
    src={participant.profilePictureUrl}
    alt={`${participant.firstName}'s Profile`}
    className="w-8 h-8 rounded-full mr-2"
  />
  <span className="text-sm font-medium text-gray-900">{participant.firstName}</span>
</div>

          <input
            defaultValue={props?.result?.score}
            name="score"
            type="text"
            {...register('score')}
            className={`block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-100 rounded-lg bg-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
              errors.score ? 'is-invalid' : ''
            }`}
            placeholder="score"
          />
          <div className="invalid-feedback">{errors.score?.message}</div>
          <button
            disabled={isSubmitting}
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-1"></span>
                <span className="font-medium">Processing...</span>
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
