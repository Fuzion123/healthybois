using AutoMapper;
using Domain.Cup;
using Domain.Cup.Input;
using Domain.Users;
using Service.Cups.Models;
using Service.Exceptions;

namespace Service.Cups
{
    public class CupService
    {
        private readonly ICupRepository cupRepository;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public CupService(ICupRepository cupRepository, IUserRepository userRepository, IMapper mapper)
        {
            this.cupRepository = cupRepository;
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public async Task<CupDto> Create(int cupOwner, CupInput cupInput, CancellationToken cancellationToken)
        {
            if(cupInput == null) throw new AppException("CupInput was null");

            if (string.IsNullOrEmpty(cupInput.Title)) throw new AppException("Title on cup cant be null or empty");

            if (await cupRepository.Exists(cupInput.Title, cancellationToken))
                throw new AppException($"Cup with title {cupInput.Title} already exists");

            var cup = new Cup(cupOwner, cupInput);

            cupRepository.Add(cup);

            await cupRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<CupDto>(cup);
        }

        public async Task<List<CupDto>> GetAllCupsReferencedByUser(int userId, CancellationToken cancellationToken)
        {
            var cups = await cupRepository.GetAllReferencedCups(userId, cancellationToken);

            return cups.Select(x => mapper.Map<CupDto>(x)).ToList();
        }

        public async Task<CupDto> GetByTitle(string title, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(title))
            {
                throw new ArgumentException($"'{nameof(title)}' cannot be null or empty.", nameof(title));
            }

            var cup = await cupRepository.GetByTitle(title, cancellationToken);

            return mapper.Map<CupDto>(cup);
        }

        public async Task<CupDto> GetById(int cupId, int userId, CancellationToken cancellationToken)
        {
            var cup = await cupRepository.GetById(cupId, cancellationToken);

            if (cup == null)
                return null;

            if (cup.OwnerUserId == userId || cup.Participants.Any(x => x.UserId == userId))
                return mapper.Map<CupDto>(cup);

             throw new AppException($"Current user does not have access to cup with id {cupId}");
        }

        public async Task Remove(int cupId, int ownerUserId, CancellationToken cancellationToken)
        {
            var cup = await cupRepository.GetById(cupId, cancellationToken);

            if(cup == null)
                return;

            if(cup.OwnerUserId != ownerUserId)
            {
                throw new AppException($"Cant remove cup because the current user is not the owner of cup with id '{cupId}'");
            }

            cupRepository.Remove(cup);

            await cupRepository.SaveChangesAsync(cancellationToken);
        }

        public async Task<CupDto> AddParticipant(int cupId, ParticipantInput input, int ownerUserId, CancellationToken cancellationToken)
        {
            var exist = await userRepository.Exists(input.UserId, cancellationToken);

            if (!exist)
                throw new AppException($"No user with id {input.UserId} exist. Cant add this participant to the cup");

            var cup = await cupRepository.GetById(cupId, cancellationToken);

            if (cup.OwnerUserId != ownerUserId)
            {
                throw new AppException($"Cant add participant to cup because the current user is not the owner of this cup");
            }

            cup.AddParticipant(input);

            await cupRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<CupDto>(cup);
        }

        public async Task<CupDto> RemoveParticipant(int cupId, ParticipantInput input, int ownerUserId, CancellationToken cancellationToken)
        {
            var cup = await cupRepository.GetById(cupId, cancellationToken);

            if (cup.OwnerUserId != ownerUserId)
            {
                throw new AppException($"Cant remove participant to cup because the current user is not the owner of this cup");
            }

            cup.RemoveParticipant(input);

            await cupRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<CupDto>(cup);
        }
    }
}
