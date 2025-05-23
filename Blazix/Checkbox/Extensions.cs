using System.ComponentModel;

namespace Blazix.Checkbox;
internal static class CheckedStateExtensions
{
    /// <summary>
    /// Converts a nullable boolean to a CheckedState.
    /// </summary>
    internal static CheckedState ToCheckedState(this bool? value) => value switch
    {
        true => CheckedState.Checked,
        false => CheckedState.Unchecked,
        null => CheckedState.Indeterminate,
    };

    /// <summary>
    /// Converts a CheckedState to a nullable boolean.
    /// </summary>
    internal static bool? ToNullableBool(this CheckedState value) => value switch
    {
        CheckedState.Checked => true,
        CheckedState.Unchecked => false,
        CheckedState.Indeterminate => null,
        _ => throw new InvalidEnumArgumentException(nameof(value), (int)value, typeof(CheckedState))
    };

    /// <summary>
    /// Gets the data-state attribute value for the CheckedState.
    /// </summary>
    internal static string GetDataState(this CheckedState value) => value switch
    {
        CheckedState.Checked => "checked",
        CheckedState.Unchecked => "unchecked",
        CheckedState.Indeterminate => "indeterminate",
        _ => throw new InvalidEnumArgumentException(nameof(value), (int)value, typeof(CheckedState))
    };

    /// <summary>
    /// Gets the aria-checked attribute value for the CheckedState.
    /// </summary>
    internal static string GetAriaChecked(this CheckedState value) => value switch
    {
        CheckedState.Checked => "true",
        CheckedState.Unchecked => "false",
        CheckedState.Indeterminate => "mixed",
        _ => throw new InvalidEnumArgumentException(nameof(value), (int)value, typeof(CheckedState))
    };
}
