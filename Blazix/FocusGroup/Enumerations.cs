namespace Blazix.FocusGroup;

/// <summary>
/// The navigation intent of the focused element.
/// </summary>
public enum FocusIntent
{
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
