using Microsoft.Azure.Storage;
using Microsoft.Extensions.DependencyInjection;
using Novicell.Shopify.CustomerConnector.Infrastructure.JobStorage.Blob;
using Service;

namespace Infrastructure.JobStorage
{
    public static class JobStorageExtensions
    {
        public static IServiceCollection AddBlobJobStorage(this IServiceCollection serviceDescriptors, string storageAccount)
        {
            var cloudStorageAccount = CloudStorageAccount.Parse(storageAccount ?? throw new NullReferenceException(nameof(storageAccount)));

            serviceDescriptors.AddSingleton(new BlobJobStorageSettings(cloudStorageAccount, storageAccount));
            serviceDescriptors.AddSingleton<IJobStorage, BlobJobStorage>();

            return serviceDescriptors;
        }
    }
}
