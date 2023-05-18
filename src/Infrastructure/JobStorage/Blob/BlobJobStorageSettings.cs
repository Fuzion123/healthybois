using Microsoft.Azure.Storage;

namespace Novicell.Shopify.CustomerConnector.Infrastructure.JobStorage.Blob
{
    public class BlobJobStorageSettings
    {
        public CloudStorageAccount Account { get; }
        public string StorageAccount { get; }

        public BlobJobStorageSettings(CloudStorageAccount account, string storageAccount)
        {
            Account = account;
            StorageAccount = storageAccount;
        }
    }
}
