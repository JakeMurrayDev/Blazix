namespace Blazix.DismissableLayer;

/// <summary>
/// Context interface for dismissable layer functionality.
/// </summary>
public interface IDismissableLayerContext
{
    /// <summary>
    /// Gets a value indicating whether outside pointer events are disabled.
    /// </summary>
    bool DisableOutsidePointerEvents { get; }

    /// <summary>
    /// Gets the pointer events style value for the layer.
    /// </summary>
    string? PointerEventsStyle { get; }
}

internal sealed class DismissableLayerContext : IDismissableLayerContext
{
    private bool isBodyPointerEventsDisabled;
    private bool isPointerEventsEnabled;

    public bool DisableOutsidePointerEvents { get; }

    public string? PointerEventsStyle
    {
        get
        {
            if (!isBodyPointerEventsDisabled) return null;
            return isPointerEventsEnabled ? "auto" : "none";
        }
    }

    public DismissableLayerContext(bool disableOutsidePointerEvents)
    {
        DisableOutsidePointerEvents = disableOutsidePointerEvents;
        isPointerEventsEnabled = true;
    }

    internal void UpdatePointerEventsState(bool bodyDisabled, bool enabled)
    {
        isBodyPointerEventsDisabled = bodyDisabled;
        isPointerEventsEnabled = enabled;
    }
}