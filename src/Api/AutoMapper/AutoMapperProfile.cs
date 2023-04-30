namespace WebApi.AutoMapper;

using Domain.Events;
using Domain.Users;
using global::AutoMapper;
using Service.Events.Models;
using Service.Users.Models;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // User -> AuthenticateResponse
        CreateMap<User, AuthenticateResponse>();

        // RegisterRequest -> User
        CreateMap<RegisterRequest, User>();

        // UpdateRequest -> User
        CreateMap<UpdateRequest, User>()
            .ForAllMembers(x => x.Condition(
                (src, dest, prop) =>
                {
                    // ignore null & empty string properties
                    if (prop == null) return false;
                    if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

                    return true;
                }
            ));

        CreateMap<Event, EventDto>()
            .ForMember(dest => dest.Participants, opt => opt.MapFrom(src => src.Participants.Select(p => new ParticipantDto() 
            { 
                UserId = p.UserId,
            }).ToList()))
            .ForMember(dest => dest.Activities, opt => opt.MapFrom(src => src.Activities.Select(p => new ActivityDto() 
            {
                OwnerUserId = p.OwnerUserId,
                EventId = p.EventId,
                Id = p.Id,
                CreatedAt = p.CreatedAt,
                Title = p.Title,
                UpdatedAt = p.UpdatedAt,
                Results = p.Results.Select(r => new ResultDto()
                {
                    Id = r.Id,
                    ActivityId = r.ActivityId,
                    CreatedAt = r.CreatedAt,
                    ParticipantId = r.ParticipantId,
                    Score = r.Score
                }).ToList()
            }).ToList()));
    }
}