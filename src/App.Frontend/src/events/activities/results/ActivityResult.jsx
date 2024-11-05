export default function ActivityResult(props) {
  const { participant, result, updateScore } = props;

  return (
    <div className="flex items-center">
      <div className="flex-col basis-1/4">
        <img
          src={participant.profilePictureUrl}
          alt={`${participant.firstName}'s Profile`}
          className="rounded-full h-20"
        />
      </div>

      <div className="flex-col w-full basis-3/4">
        <div>{participant.firstName}</div>
        <input
          id={participant.id + "resultId"}
          defaultValue={result?.score}
          name="score"
          type="number"
          className={`w-full text-sm text-gray-900 border border-gray-100 rounded-lg bg-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          placeholder="score"
          onKeyUp={() =>
            updateScore(
              participant.id,
              document.getElementById(participant.id + "resultId").value
            )
          }
        />
      </div>
    </div>
  );
}
