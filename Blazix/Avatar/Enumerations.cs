namespace Blazix.Avatar;

/// <summary>
/// The status of the <see cref="AvatarImage"/> being loaded.
/// </summary>
public enum ImageLoadingStatus
{
    /// <summary>
    /// The image is not being loaded.
    /// </summary>
    Idle,
    /// <summary>
    /// The image is being loaded.
    /// </summary>
    Loading,
    /// <summary>
    /// The image has been loaded.
    /// </summary>
    Loaded,
    /// <summary>
    /// The image failed to load.
    /// </summary>
    Error
}
