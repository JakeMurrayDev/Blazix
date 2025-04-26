using Microsoft.AspNetCore.Components;

namespace Blazix.Avatar;
internal class AvatarContext : ComponentBase
{
    /// <summary>
    /// The status of the <see cref="AvatarImage"/> being loaded.
    /// </summary>
    internal ImageLoadingStatus Status { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="AvatarFallback"/> for the <see cref="AvatarRoot"/>.
    /// <para>
    /// This needs to be re-rendered when the <see cref="Status"/> changes.
    /// </para>
    /// </summary>
    internal AvatarFallback? Fallback { get; set; }
}
