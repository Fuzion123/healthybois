using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Extensions.Logging;
using Service;
using System.Text;
using System.Text.Json;


namespace Novicell.Shopify.CustomerConnector.Infrastructure.JobStorage.Blob
{

    public class BlobJobStorage : IJobStorage
    {
        private readonly BlobJobStorageSettings settings;
        private const string blobContainer = "healthy-storage";

        public BlobJobStorage(BlobJobStorageSettings settings)
        {
            this.settings = settings;
        }

        private async Task<CloudBlobContainer> GetBlobContainer(CancellationToken cancellationToken)
        {
            var blobClient = settings.Account.CreateCloudBlobClient();

            var containerClient = blobClient.GetContainerReference(blobContainer);

            await containerClient.CreateIfNotExistsAsync(cancellationToken).ConfigureAwait(false);

            return containerClient;
        }

        public async Task<Guid> Add<T>(T data, CancellationToken cancellationToken) where T : class
        {
            var id = Guid.NewGuid();
            var bloblReference = id.ToString();

            var blobContainerClient = await GetBlobContainer(cancellationToken).ConfigureAwait(false);

            var blob = blobContainerClient.GetBlockBlobReference(bloblReference);

            await blob.UploadTextAsync(JsonSerializer.Serialize(data), Encoding.UTF8, default, default, default, cancellationToken);

            return id;
        }

        public async Task Delete(Guid id, CancellationToken cancellationToken)
        {
            var bloblReference = id.ToString();

            var blobContainerClient = await GetBlobContainer(cancellationToken).ConfigureAwait(false);

            var blob = blobContainerClient.GetBlockBlobReference(bloblReference);

            await blob.DeleteIfExistsAsync(cancellationToken);
        }

        public async Task<T> Get<T>(Guid id, CancellationToken cancellationToken) where T : class
        {
            var bloblReference = id.ToString();

            var blobContainerClient = await GetBlobContainer(cancellationToken).ConfigureAwait(false);

            var blob = blobContainerClient.GetBlockBlobReference(bloblReference);

            var response = await blob.DownloadTextAsync(Encoding.UTF8, default, default, default, cancellationToken).ConfigureAwait(false);

            return JsonSerializer.Deserialize<T>(response);
        }

        public async Task<string> UploadBase64Stream(string fileName, string base64, CancellationToken cancellationToken)
        {
            var blobContainerClient = await GetBlobContainer(cancellationToken).ConfigureAwait(false);

            var blob = blobContainerClient.GetBlockBlobReference(fileName);

            // without data:image/jpeg;base64 prefix, just base64 string
            var bytes = Convert.FromBase64String(base64);

            using (var stream = new MemoryStream(bytes))
            {
                blob.UploadFromStream(stream);
            }

            return fileName;
        }

        public Uri GetServiceSasUriForBlob(string blobName, string storedPolicyName = null)
        {
            if (string.IsNullOrEmpty(blobName))
                return null;

            var blobClient = new BlobClient(
                    settings.StorageAccount,
                    blobContainer,
                    blobName);

            // Check whether this BlobClient object has been authorized with Shared Key.
            if (blobClient.CanGenerateSasUri)
            {
                // Create a SAS token that's valid for one hour.
                BlobSasBuilder sasBuilder = new BlobSasBuilder()
                {
                    BlobContainerName = blobClient.GetParentBlobContainerClient().Name,
                    BlobName = blobClient.Name,
                    Resource = "b"
                };

                if (storedPolicyName == null)
                {
                    sasBuilder.ExpiresOn = DateTimeOffset.UtcNow.AddDays(3);

                    sasBuilder.SetPermissions(BlobSasPermissions.Read);
                }
                else
                {
                    sasBuilder.Identifier = storedPolicyName;
                }

                Uri sasUri = blobClient.GenerateSasUri(sasBuilder);

                return sasUri;
            }
            else
            {
                return null;
            }
        }
    }
}
