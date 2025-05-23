namespace Blazix.Switch;

/// <summary>
/// Represents the state and properties shared within a Switch component tree.
/// </summary>
/// <param name="Checked">The current checked state of the switch.</param>
/// <param name="Disabled">Whether the switch is disabled.</param>
internal sealed record SwitchContext(bool Checked, bool Disabled);
