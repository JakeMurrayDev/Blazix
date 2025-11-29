namespace Blazix.Toolbar;

/// <summary>
/// Context record for toolbar state.
/// </summary>
internal sealed record ToolbarContext(
    Orientation Orientation,
    ReadingDirection ReadingDirection);