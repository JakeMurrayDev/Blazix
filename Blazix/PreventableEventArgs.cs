namespace Blazix;

/// <summary>
/// Event arguments for events that can be prevented.
/// </summary>
public class PreventableEventArgs : EventArgs
{
    /// <summary>
    /// Gets or sets a value indicating whether the default behavior should be prevented.
    /// </summary>
    public bool Prevented { get; set; }
}

/// <summary>
/// Event arguments for pointer down outside events.
/// </summary>
public class PointerDownOutsideEventArgs : PreventableEventArgs
{
    /// <summary>
    /// Gets the target element that received the pointer down event.
    /// </summary>
    public required string TargetId { get; init; }

    /// <summary>
    /// Gets the button that was pressed (0 = left, 1 = middle, 2 = right).
    /// </summary>
    public int Button { get; init; }

    /// <summary>
    /// Gets a value indicating whether the Ctrl key was pressed.
    /// </summary>
    public bool CtrlKey { get; init; }
}

/// <summary>
/// Event arguments for focus outside events.
/// </summary>
public class FocusOutsideEventArgs : PreventableEventArgs
{
    /// <summary>
    /// Gets the target element that received focus.
    /// </summary>
    public required string TargetId { get; init; }
}

/// <summary>
/// Event arguments for escape key down events.
/// </summary>
public class EscapeKeyDownEventArgs : PreventableEventArgs
{
}