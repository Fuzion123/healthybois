using System.Net.Sockets;

namespace Domain.Users;

public class User
{
    public int Id { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string UserName { get; private set; }
    public string PasswordHash { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public Role Role { get; set; }

    private User()
    {
    }

    public User(string firstName, string lastName, string userName, string passwordHash) : base()
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
    }

    public bool Update(string firstName, string lastName, string passwordHash)
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

        if (updated)
        {
            UpdatedAt = DateTime.UtcNow;
        }

        return updated;
    }
}