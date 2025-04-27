namespace Blazix.Checkbox;

/// <summary>
/// Represents the possible checked states of the Checkbox.
/// Using a specific enum/struct can be clearer than bool?
/// </summary>
internal enum CheckedState
{
    /// <summary>
    /// The checkbox is unchecked.
    /// </summary>
    Unchecked,
    /// <summary>
    /// The checkbox is checked.
    /// </summary>
    Checked,
    /// <summary>
    /// The checkbox is in an indeterminate state.
    /// </summary>
    Indeterminate
}
