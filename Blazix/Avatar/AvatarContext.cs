using Microsoft.AspNetCore.Components;

namespace Blazix.Avatar;

internal class AvatarContext
{
    /// <summary>
    /// The status of the <see cref="AvatarImage"/> being loaded.
    /// </summary>
    internal ImageLoadingStatus Status { get; private set; } = ImageLoadingStatus.Idle;

    /// <summary>
    /// Action to notify subscribers (<see cref="AvatarImage"/> and <see cref="AvatarFallback"/>) about status changes.
    /// </summary>
    internal Func<ImageLoadingStatus, Task>? OnStatusChange { get; set; }

    /// <summary>
    /// Sets the status of the <see cref="AvatarImage"/> being loaded
    /// </summary>
    /// <param name="newStatus">The new status.</param>
    internal async Task SetStatusAsync(ImageLoadingStatus newStatus)
    {
        if (Status != newStatus)
        {
            Status = newStatus;
            if (OnStatusChange != null)
            {
                // Use await Task.Yield() to ensure the UI updates happen asynchronously
                // if multiple updates occur rapidly.
                await Task.Yield();
                await OnStatusChange.Invoke(newStatus);
            }
        }
    }
}
