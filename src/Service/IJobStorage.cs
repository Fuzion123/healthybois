
namespace Service
{
    public interface IJobStorage
    {
        public Task<Guid> Add<T>(T data, CancellationToken cancellationToken) where T : class;
        public Task<T> Get<T>(Guid id, CancellationToken cancellationToken) where T : class;
        public Task Delete(Guid id, CancellationToken cancellationToken);
        public Task<string> UploadBase64Stream(string fileName, string base64, CancellationToken cancellationToken);
        public Uri GetServiceSasUriForBlob(string blobName, string storedPolicyName = null);
    }
}
