using System.ComponentModel;

namespace Blazix.Progress;

internal static class ProgressExtensions
{
    /// <summary>
    /// Gets the string representation of the ProgressState.
    /// </summary>
    internal static string GetDataState(this ProgressState state) => state switch
    {
        ProgressState.Indeterminate => "indeterminate",
        ProgressState.Loading => "loading",
        ProgressState.Complete => "complete",
        _ => throw new InvalidEnumArgumentException(nameof(state), (int)state, typeof(ProgressState))
    };
}