namespace Blazix.Progress;


/// <summary>
/// Represents the state and properties shared within a Progress component tree.
/// </summary>
/// <param name="Value">The current value of the progress, or null if indeterminate.</param>
/// <param name="Max">The maximum value of the progress.</param>
internal sealed record ProgressContext(double? Value, double Max);
