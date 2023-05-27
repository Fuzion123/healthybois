namespace WebApi.AutoMapper;

using Domain.Events;
using Domain.Users;
using global::AutoMapper;
using Service;
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


        CreateMap<Activity, ActivityDto>()
            .ForMember(dest => dest.Results, opt => opt.MapFrom(src => src.Results.Select(p => new ResultDto()
            {
                Id = p.Id,
                ActivityId = p.ActivityId,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                ParticipantId = p.ParticipantId,
                Score = p.Score
            }).ToList()));

        CreateMap<Participant, ParticipantDto>();
        CreateMap<Result, ResultDto>();
    }
}