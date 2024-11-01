using Domain.Events.Input;

namespace Domain.Events
{
		public class Activity
		{
				public int Id { get; set; }
				public int EventId { get; set; }
				public int OwnerUserId { get; private set; }
				public string Title { get; set; }
				public DateTime CreatedAt { get; private set; }
				public DateTime UpdatedAt { get; private set; }
				public DateTime? CompletedOn { get; private set; }

				private readonly List<Result> _results;
				public IReadOnlyList<Result> Results => _results.AsReadOnly();

				private Activity()
				{
						_results = new List<Result>();
				}

				public Activity(ActivityInput input) : this()
				{
						if (input is null)
						{
								throw new ArgumentNullException(nameof(input));
						}

						EventId = input.EventId;
						OwnerUserId = input.OwnerUserId;
						Title = input.Title;
						CreatedAt = DateTime.Now;
						UpdatedAt = CreatedAt;
						CompletedOn = null;
				}

				public bool Update(ActivityUpdateInput activityInput)
				{
						if (activityInput is null)
						{
								throw new ArgumentNullException(nameof(activityInput));
						}

						if (Title != activityInput.Title)
						{
								Title = activityInput.Title;

								return true;
						}

						return false;
				}

				public bool AddOrUpdateResult(List<ResultInput> inputs)
				{
						var updated = false;

						foreach (var input in inputs)
						{
								var existing = _results.FirstOrDefault(x => x.ParticipantId == input.ParticipantId);

								if (existing != null)
								{
										if (existing.Update(input.Score))
										{
												updated = true;
										}
								}
								else
								{
										_results.Add(new Result(Id, input));

										updated = true;
								}
						}

						if (updated)
						{
								UpdatedAt = DateTime.Now;
						}

						return updated;
				}

				public bool RemoveResult(int resultId)
				{
						var updated = false;

						var existing = _results.FirstOrDefault(x => x.Id == resultId);

						if (existing != null)
						{
								_results.Remove(existing);

								updated = true;
						}

						if (updated)
						{
								UpdatedAt = DateTime.Now;
						}

						return updated;
				}

				public void SetCompleted(DateTime dateTime)
				{
						CompletedOn = dateTime;
				}

				public void SetUnCompleted()
				{
						CompletedOn = null;
				}
		}
}
