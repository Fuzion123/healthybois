namespace Service.Users;

using AutoMapper;
using Domain.Users;
using Service.Users.Dependencies;
using Service.Users.Models;
using BCrypt.Net;
using Service.Exceptions;
using Microsoft.AspNetCore.StaticFiles;
using System.Reflection;

public class UserService : IUserService
{
    private readonly IUserRepository userRepository;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;
    private readonly PictureService pictureService;

    public UserService(
        IUserRepository userRepository,
        IJwtUtils jwtUtils,
        IMapper mapper,
        PictureService pictureService)
    {
        this.userRepository = userRepository;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
        this.pictureService = pictureService;
    }

    public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByUserName(model.Username, cancellationToken);

        // validate
        if (user == null || !BCrypt.Verify(model.Password, user.PasswordHash))
            throw new AppException("Username or password is incorrect");

        var url = pictureService.GetPicture(user.ProfilePictureId);

        // authentication successful
        var response = _mapper.Map<AuthenticateResponse>(user);

        response.Token = _jwtUtils.GenerateToken(user);
        response.ProfilePictureUrl = url;

        return response;
    }

    public async Task<List<UserDto>> GetAll(CancellationToken cancellationToken)
    {
        var users = await userRepository.GetAll(cancellationToken);

        return users.Select(x =>
        {
            var url = pictureService.GetPicture(x.ProfilePictureId);

            return new UserDto()
            {
                CreatedAt = x.CreatedAt,
                FirstName = x.FirstName,
                Id = x.Id,
                LastName = x.LastName,
                PasswordHash = x.PasswordHash,
                Role = x.Role,
                UpdatedAt = x.UpdatedAt,
                UserName = x.UserName,
                Email = x.Email,
                ProfileUrl = url
            };

        }).ToList();
    }

    public async Task<UserDto> GetById(int id, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetById(id, cancellationToken);

        if(user != null)
        {
            var url = pictureService.GetPicture(user.ProfilePictureId);

            return new UserDto()
            {
                CreatedAt = user.CreatedAt,
                FirstName = user.FirstName,
                Id = user.Id,
                LastName = user.LastName,
                PasswordHash = user.PasswordHash,
                Role = user.Role,
                UpdatedAt = user.UpdatedAt,
                UserName = user.UserName,
                Email = user.Email,
                ProfileUrl = url
            };
        }

        return null;
    }

    public async Task Register(RegisterRequest model, CancellationToken cancellationToken)
    {
        // validate
        if (await userRepository.Exists(model.Username, model.Email, cancellationToken))
            throw new AppException("Username or email is already taken");

        // hash password
        var passwordHash = BCrypt.HashPassword(model.Password);

        // image
        string profilePictureId = default;

        if (model.ProfilePicture != null)
        {
            profilePictureId = await pictureService.AddPicture(model.ProfilePicture, cancellationToken);
        }

        var user = new User(model.FirstName, model.LastName, model.Email, model.Username, passwordHash, profilePictureId);

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

         user.Update(model.FirstName, model.LastName, passwordHash, null);

        await userRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task Delete(int id, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetById(id, cancellationToken);

        userRepository.Remove(user);

        await userRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task ResetPassword(string email,ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByUserName(email, cancellationToken);

        if (user == null) 
        {
            throw new AppException("No user found for recover email, cant reset password. Try to resubmit a restore password request for you email");
        }

        if(request.NewPassword != request.NewPasswordConfirm)
        {
            throw new AppException("The new password and the confirmation of the new password does not match each other.");
        }

        // hash password
        var passwordHash = BCrypt.HashPassword(request.NewPassword);

        user.UpdatePassword(passwordHash);

        await userRepository.SaveChangesAsync(cancellationToken);
    }

    private string ChangePassword(string oldPassword, string currentHash, string newPassword)
    {
        try
        {
            var passwordHash = BCrypt.ValidateAndReplacePassword(oldPassword, currentHash, newPassword);

            return passwordHash;
        }
        catch
        {
            throw new Exception("Old password is not correct.");
        }
    }
}