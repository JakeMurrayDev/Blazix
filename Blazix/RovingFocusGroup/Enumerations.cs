namespace Blazix.RovingFocusGroup;

/// <summary>
/// The navigation intent of the focused element.
/// </summary>
public enum FocusIntent
{
    /// <summary>
    /// Undefined focus intent
    /// </summary>
    Undefined,
    /// <summary>
    /// Focus the first element.
    /// </summary>
    First,
    /// <summary>
    /// Focus the last element.
    /// </summary>
    Last,
    /// <summary>
    /// Focus the previous element.
    /// </summary>
    Prev,
    /// <summary>
    /// Focus the next element.
    /// </summary>
    Next
}