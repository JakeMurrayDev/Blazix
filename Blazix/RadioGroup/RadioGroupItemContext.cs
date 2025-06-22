namespace Blazix.RadioGroup;

/// <summary>
/// Provides state for a specific RadioGroupItem to its Indicator.
/// </summary>
internal sealed record RadioGroupItemContext(bool Checked, bool Disabled);