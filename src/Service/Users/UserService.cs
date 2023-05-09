namespace Service.Users;

using AutoMapper;
using Domain.Users;
using Service.Users.Dependencies;
using Service.Users.Models;
using BCrypt.Net;
using Service.Exceptions;

public class UserService : IUserService
{
    private readonly IUserRepository userRepository;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;

    public UserService(
        IUserRepository userRepository,
        IJwtUtils jwtUtils,
        IMapper mapper)
    {
        this.userRepository = userRepository;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
    }

    public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByUserName(model.Username, cancellationToken);

        // validate
        if (user == null || !BCrypt.Verify(model.Password, user.PasswordHash))
            throw new AppException("Username or password is incorrect");

        // authentication successful
        var response = _mapper.Map<AuthenticateResponse>(user);

        // Fetch profile picture URL from the backend API and add it to the response
        //var profilePictureUrl = await GetProfilePictureUrl(user.Id, cancellationToken);
        //response.ProfilePicture = profilePictureUrl;

        response.Token = _jwtUtils.GenerateToken(user);

        return response;
    }

    public async Task<List<User>> GetAll(CancellationToken cancellationToken)
    {
        return await userRepository.GetAll(cancellationToken);
    }

    public async Task<User> GetById(int id, CancellationToken cancellationToken)
    {
        return await userRepository.GetById(id, cancellationToken);
    }

    public async Task Register(RegisterRequest model, CancellationToken cancellationToken)
    {
        // validate
        if (await userRepository.Exists(model.Username, cancellationToken))
            throw new AppException("Username '" + model.Username + "' is already taken");

        // hash password
        var passwordHash = BCrypt.HashPassword(model.Password);

        var user = new User(model.FirstName, model.LastName, model.Username, passwordHash);

        // save user
        userRepository.Add(user);

        await userRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task Update(int id, UpdateRequest model, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetById(id, cancellationToken);

        // validate
        if (model.Username != user.UserName && await userRepository.Exists(model.Username, cancellationToken))
            throw new AppException("Username '" + model.Username + "' is already taken");

        string passwordHash = null;

        // hash password if it was entered
        if (!string.IsNullOrEmpty(model.Password))
            passwordHash = BCrypt.HashPassword(model.Password);

        //// update profile picture if provided
        //if (model.ProfilePicture != null)
        //{
        //    user.ProfilePicture = model.ProfilePicture;
        //}

         user.Update(model.FirstName, model.LastName, passwordHash);

        await userRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task Delete(int id, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetById(id, cancellationToken);

        userRepository.Remove(user);

        await userRepository.SaveChangesAsync(cancellationToken);
    }
}