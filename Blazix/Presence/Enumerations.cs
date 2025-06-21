namespace Blazix.Presence;

/// <summary>
/// Enumeration representing the state of a presence component.
/// </summary>
public enum PresenceState
{
    /// <summary>
    /// The component is visible and active in the DOM.
    /// </summary>
    Mounted,
    /// <summary>
    /// The component has been instructed to unmount but is kept in the DOM temporarily to allow an exit animation to complete.
    /// </summary>
    UnmountSuspended,
    /// <summary>
    /// The component is not rendered in the DOM.
    /// </summary>
    Unmounted
}

/// <summary>
/// Enumeration representing the event of a presence component.
/// </summary>
public enum PresenceEvent
{
    /// <summary>
    /// An event that signals the component should transition to a mounted state.
    /// </summary>
    Mount,
    /// <summary>
    /// An event that signals the component should unmount immediately, bypassing any animations.
    /// </summary>
    Unmount,
    /// <summary>
    /// An event that signals the component should begin its exit animation, transitioning it to the <see cref="PresenceState.UnmountSuspended"/> state.
    /// </summary>
    AnimationOut,
    /// <summary>
    /// An event, typically from JavaScript, signaling that a CSS animation or transition has finished.
    /// </summary>
    AnimationEnd
}
