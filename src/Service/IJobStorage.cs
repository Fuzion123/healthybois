
namespace Service
{
    public interface IJobStorage
    {
        public Task Add<T>(string blobName, T data, CancellationToken cancellationToken) where T : class;
        public Task<T> Get<T>(string id, CancellationToken cancellationToken) where T : class;
        public Task Delete(string id, CancellationToken cancellationToken);
        public Task<string> UploadBase64Stream(string fileName, string base64, CancellationToken cancellationToken);
        public Uri GetServiceSasUriForBlob(string blobName, string storedPolicyName = null);
        public Task<bool> Exists(string blobName, CancellationToken cancellationToken);
    }
}
