using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using System.ComponentModel;

namespace Blazix.FocusGroup;

/// <summary>
/// Provides functionality for focusable items within a focus group.
/// </summary>
internal sealed record FocusGroupContext
{
    /// <summary>
    /// Action to register a focusable component with the group.
    /// </summary>
    internal Action<FocusGroupItem> RegisterItem { get; init; }

    /// <summary>
    /// Action to unregister a focusable component from the group.
    /// </summary>
    internal Func<FocusGroupItem, bool> UnregisterItem { get; init; }

    /// <summary>
    /// Action to notify the group when an item receives focus.
    /// </summary>
    internal Action<FocusGroupItem> NotifyItemFocused { get; init; }

    /// <summary>
    /// Action to handle key down events for navigation within the group.
    /// </summary>
    internal Func<KeyboardEventArgs, Task> OnKeyDown { get; init; }

    // Potentially add other shared properties if needed by items, e.g.:
    // internal Orientation CurrentOrientation { get; init; }
    // internal bool IsRovingFocusEnabled { get; init; }
    // However, for now, the actions might be sufficient if items only delegate keydown.

    public FocusGroupContext(
        Action<FocusGroupItem> registerItem,
        Func<FocusGroupItem, bool> unregisterItem,
        Action<FocusGroupItem> notifyItemFocused,
        Func<KeyboardEventArgs, Task> handleKeyDownAsync)
    {
        RegisterItem = registerItem ?? throw new ArgumentNullException(nameof(registerItem));
        UnregisterItem = unregisterItem ?? throw new ArgumentNullException(nameof(unregisterItem));
        NotifyItemFocused = notifyItemFocused ?? throw new ArgumentNullException(nameof(notifyItemFocused));
        OnKeyDown = handleKeyDownAsync ?? throw new ArgumentNullException(nameof(handleKeyDownAsync));
    }
}
