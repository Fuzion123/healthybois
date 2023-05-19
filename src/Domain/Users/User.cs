using Domain.Exceptions;

namespace Domain.Users;

public class User
{
    public int Id { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Email { get; private set; }
    public string UserName { get; private set; }
    public string PasswordHash { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public Role Role { get; private set; }
    public string ProfilePictureId { get; private set; }

    private User()
    {
    }

    public User(string firstName, string lastName, string email, string userName, string passwordHash, string profilePictureId) : base()
    {
        if (string.IsNullOrEmpty(firstName))
        {
            throw new ArgumentException($"'{nameof(firstName)}' cannot be null or empty.", nameof(firstName));
        }

        if (string.IsNullOrEmpty(lastName))
        {
            throw new ArgumentException($"'{nameof(lastName)}' cannot be null or empty.", nameof(lastName));
        }

        if (string.IsNullOrEmpty(userName))
        {
            throw new ArgumentException($"'{nameof(userName)}' cannot be null or empty.", nameof(userName));
        }

        if (string.IsNullOrEmpty(passwordHash))
        {
            throw new ArgumentException($"'{nameof(passwordHash)}' cannot be null or empty.", nameof(passwordHash));
        }

        FirstName = firstName;
        LastName = lastName;
        UserName = userName;
        PasswordHash = passwordHash;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
        Role = Role.User;
        ProfilePictureId = profilePictureId;
        Email = email;
     }

    public bool Update(string firstName, string lastName, string passwordHash, string profilePictureId)
    {
        var updated = false;

        if (string.IsNullOrEmpty(firstName))
        {
            throw new ArgumentException($"'{nameof(firstName)}' cannot be null or empty.", nameof(firstName));
        }

        if (string.IsNullOrEmpty(lastName))
        {
            throw new ArgumentException($"'{nameof(lastName)}' cannot be null or empty.", nameof(lastName));
        }

        if(FirstName != firstName)
        {
            FirstName = firstName;

            updated = true;
        }

        if (LastName != lastName)
        {
            LastName = lastName;

            updated = true;
        }

        if (!string.IsNullOrEmpty(passwordHash) && PasswordHash != passwordHash)
        {
            PasswordHash = passwordHash;

            updated = true;
        }

        if(ProfilePictureId != profilePictureId)
        {
            updated = true;

            ProfilePictureId = profilePictureId;
        }

        if (updated)
        {
            UpdatedAt = DateTime.UtcNow;
        }

        return updated;
    }

    public void SetOrUpdateProfilePciture(string profilePictureId)
    {
        ProfilePictureId = ProfilePictureId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DeleteProfilePicture()
    {
        ProfilePictureId = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePassword(string passwordHash)
    {
        if (string.IsNullOrEmpty(passwordHash))
        {
            throw new ArgumentException($"'{nameof(passwordHash)}' cannot be null or empty.", nameof(passwordHash));
        }

        if(PasswordHash == passwordHash) 
        {
            throw new DomainException("New password can't be the same as the old password. Please enter a different password.");
        }

        PasswordHash = passwordHash;
        UpdatedAt = DateTime.UtcNow;
    }
}