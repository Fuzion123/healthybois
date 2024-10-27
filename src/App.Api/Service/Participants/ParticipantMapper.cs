using Domain.Users;
using Service.Participants.Models;

namespace Service.Participants
{
    public class ParticipantMapper
    {
        private readonly PictureService pictureService;

        public ParticipantMapper(PictureService pictureService)
        {
            this.pictureService = pictureService;
        }

        public UserParticipantDto MapParticipantFromUser(int participantId, User user)
        {
            if (user == null)
                return null;

            return new UserParticipantDto()
            {
                Id = participantId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserId = user.Id,
                ProfilePictureUrl = pictureService.GetPicture(user.ProfilePictureId)
            };
        }
    }
}
