export default function ActivityResult(props) {
  const { participant, result, updateScore } = props;

  return (
    <div>
      <label
        htmlFor="score"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        score
      </label>
      <div className="relative">
        <div className="mb-2 flex items-center">
          <img
            src={participant.profilePictureUrl}
            alt={`${participant.firstName}'s Profile`}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm font-medium text-gray-900">
            {participant.firstName}
          </span>
        </div>

        <input
          id={participant.id + "resultId"}
          defaultValue={result?.score}
          name="score"
          type="number"
          // {...register("score")}
          className={`block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-100 rounded-lg bg-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
          //   errors.score ? "is-invalid" : ""
          // }`}
          placeholder="score"
          onKeyUp={() =>
            updateScore(
              participant.id,
              document.getElementById(participant.id + "resultId").value
            )
          }
        />
        {/* <div className="invalid-feedback">{errors.score?.message}</div> */}
      </div>
    </div>
  );
}
