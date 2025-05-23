namespace Blazix.Switch;

internal static class SwitchStateExtensions
{
    /// <summary>
    /// Gets the data-state attribute value for the Switch state.
    /// </summary>
    internal static string GetDataState(this bool value) => value ? "checked" : "unchecked";
}
