namespace Blazix.FocusScope;

/// <summary>
/// Context interface for focus scope functionality.
/// </summary>
public interface IFocusScopeContext
{
    /// <summary>
    /// Gets a value indicating whether tab navigation should loop from last to first and vice versa.
    /// </summary>
    bool Loop { get; }

    /// <summary>
    /// Gets a value indicating whether focus is trapped within the scope.
    /// </summary>
    bool Trapped { get; }

    /// <summary>
    /// Gets the tab index for the focus scope container.
    /// </summary>
    int TabIndex { get; }

    /// <summary>
    /// Gets the inline style for the focus scope container.
    /// </summary>
    string? Style { get; }
}

internal sealed record FocusScopeContext(
    bool Loop,
    bool Trapped) : IFocusScopeContext
{
    public int TabIndex => -1;
    public string? Style => "outline: none;";
}