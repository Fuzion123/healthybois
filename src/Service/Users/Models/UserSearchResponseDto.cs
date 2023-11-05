namespace WebApi.Models.Users
{
    public class UserSearchResponseDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public Uri ProfilePictureUri { get; set; }
    }
}