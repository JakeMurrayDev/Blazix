namespace Blazix.Checkbox;

/// <summary>
/// Represents the state and properties shared within a Checkbox component tree.
/// </summary>
/// <param name="State">The current checked state of the checkbox.</param>
/// <param name="Disabled">Whether the checkbox is disabled.</param>
internal sealed record CheckboxContext(CheckedState State, bool Disabled);
