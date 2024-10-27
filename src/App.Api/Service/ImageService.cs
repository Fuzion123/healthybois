using Domain.Pictures.Inputs;
using Microsoft.AspNetCore.StaticFiles;
using Service.Exceptions;

namespace Service
{
    public class PictureService
    {
        private readonly IJobStorage jobStorage;

        public PictureService(IJobStorage jobStorage)
        {
            this.jobStorage = jobStorage;
        }

        public async Task<string> AddPicture(PictureInput profilePicture, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(profilePicture.Base64))
            {
                throw new AppException("profile picture base64 is null/empty");
            }

            if (!new FileExtensionContentTypeProvider().TryGetContentType(profilePicture.Name, out var contentType))
            {
                throw new AppException($"Uploaded profile picture '{profilePicture.Name}' mimetype is not supported");
            }

            var fileName = $"{DateTime.Now.Ticks}-{profilePicture.Name}";

            var base64MetaInformation = $"data:{contentType};base64,";

            var rawBase64 = profilePicture.Base64.Replace(base64MetaInformation, "");

            await jobStorage.UploadBase64Stream(fileName, rawBase64, cancellationToken);

            return fileName;
        }

        public Uri GetPicture(string pictureId)
        {
            if (string.IsNullOrEmpty(pictureId))
            {
                return null;
            }

            return jobStorage.GetServiceSasUriForBlob(pictureId);
        }

        public async Task DeletePicture(string pictureId, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(pictureId))
            {
                return;
            }

            if (await jobStorage.Exists(pictureId, cancellationToken))
            {
                await jobStorage.Delete(pictureId, cancellationToken);
            }
        }
    }
}
