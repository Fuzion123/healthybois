namespace Service.Users;

using BCrypt.Net;
using Domain.Exceptions;
using Domain.Users;
using Service.Exceptions;
using Service.Users.Dependencies;
using Service.Users.Models;
using System.Threading;
using WebApi.Models.Users;

public class UserService : IUserService
{
    private readonly IUserRepository userRepository;
    private IJwtUtils jwtUtils;
    private readonly PictureService pictureService;

    public UserService(
        IUserRepository userRepository,
        IJwtUtils jwtUtils,
        PictureService pictureService)
    {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.pictureService = pictureService;
    }

    public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByUserName(model.Username, cancellationToken);

        // validate
        if (user == null || !BCrypt.Verify(model.Password, user.PasswordHash))
            throw new AppException("Username or password is incorrect");

        return new AuthenticateResponse()
        {
            Email = user.Email,
            FirstName = user.FirstName,
            Id = user.Id,
            LastName = user.LastName,
            ProfilePictureUrl = pictureService.GetPicture(user.ProfilePictureId),
            Role = user.Role,
            Token = jwtUtils.GenerateToken(user),
            Username = user.UserName
        };
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

        if (user != null)
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

        if (string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.PasswordConfirm))
        {
            throw new AppException("passwords not set");
        }

        if (model.Password != model.PasswordConfirm)
        {
            throw new AppException("password and confirm password are not equals");
        }

        if (model.Password.Length < 6)
        {
            throw new AppException("password is less than 6 characters");
        }

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

    public async Task Update(int id, UpdateRequest request, CancellationToken cancellationToken)
    {
        var updated = false;
        string error;

        var type = request.EditType;

        var user = await userRepository.GetById(id, cancellationToken);

        if (type == EditType.Full)
        {
            throw new NotSupportedException("full updates is not supported yet");
        }
        else if (type == EditType.UserName)
        {
            throw new NotSupportedException("username updates is not supported yet");

            //// validate
            //if (request.Username != user.UserName && await userRepository.Exists(request.Username, cancellationToken))
            //    throw new AppException("Username '" + request.Username + "' is already taken");
        }
        else if (type == EditType.Email)
        {
            throw new NotSupportedException("email updates is not supported yet");
        }
        else if (type == EditType.FirstName)
        {
            updated = user.UpdateFirstName(request.FirstName);

            error = !updated ? "please provide a different first name than already entered" : null;
        }
        else if (type == EditType.LastName)
        {
            updated = user.UpdateLastName(request.LastName);

            error = !updated ? "please provide a different last name than already entered" : null;
        }
        else if (type == EditType.Password)
        {
            // hash password if it was entered
            if (string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.PasswordConfirm))
            {
                throw new DomainException("requested password or passwordconfirm can't be null or empty when changing password");
            }

            if (request.Password != request.PasswordConfirm)
            {
                throw new DomainException("password and passwordconfirm needs to be the same value");
            }

            var passwordHash = BCrypt.HashPassword(request.Password);

            updated = user.UpdatePassword(passwordHash);

            error = !updated ? "please provide a different password than already entered" : null;

        }
        else if (type == EditType.ProfilePicture)
        {
            if (request.ProfilePicture != null)
            {
                var oldPictureId = user.ProfilePictureId;

                var url = await pictureService.AddPicture(request.ProfilePicture, cancellationToken);

                updated = user.SetOrUpdateProfilePciture(url);

                if (updated && !string.IsNullOrEmpty(oldPictureId))
                {
                    await pictureService.DeletePicture(oldPictureId, cancellationToken);
                }
            }

            error = !updated ? "please provide a different profile picture than already entered" : null;
        }
        else
        {
            throw new AppException("Update request recieved for a 'EditType' type not supported.");
        }

        if (updated)
        {
            await userRepository.SaveChangesAsync(cancellationToken);
        }

        if (!string.IsNullOrEmpty(error))
        {
            throw new AppException(error);
        }
    }

    public async Task Delete(int id, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetById(id, cancellationToken);

        userRepository.Remove(user);

        await userRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task ResetPassword(string email, ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByUserName(email, cancellationToken);

        if (user == null)
        {
            throw new AppException("No user found for recover email, cant reset password. Try to resubmit a restore password request for you email");
        }

        if (request.NewPassword != request.NewPasswordConfirm)
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

    public async Task<List<UserSearchResponseDto>> Search(string term, CancellationToken cancellationToken)
    {
        var users = await userRepository.Search(term, cancellationToken);

        return users.Select(x => new UserSearchResponseDto()
        {
            FirstName = x.FirstName,
            LastName = x.LastName,
            UserId = x.Id,
            ProfilePictureUri = pictureService.GetPicture(x.ProfilePictureId)
        }).ToList();
    }

    public async Task<bool> IsUserNameTaken(string userName, string email, CancellationToken cancellation)
    {
        return await userRepository.Exists(userName, email, cancellation);
    }
}