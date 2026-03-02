
namespace InsureX.Domain.Interfaces;

public interface IFileStorageService
{
    Task<string> SaveAsync(string base64Content, string fileName);
    Task DeleteAsync(string filePath);
}