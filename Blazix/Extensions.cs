using Blazix.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Blazix;

/// <summary>
/// Extension methods for registering Blazix components and services.
/// </summary>
public static class Extensions
{
    /// <summary>
    /// Registers all Blazix components and services.
    /// </summary>
    public static void AddBlazix(this IServiceCollection services)
    {
        services.AddSingleton<IReadingDirectionService, ReadingDirectionService>();
    }
}
