namespace Blazix.ToggleGroup;

internal sealed record ToggleGroupContext<TValue>
{
    /// <summary>
    /// Indicates if multiple items can be pressed.
    /// </summary>
    internal bool Multiple { get; init; }

    /// <summary>
    /// Indicates if the entire group is disabled.
    /// </summary>
    internal bool GroupDisabled { get; init; }

    /// <summary>
    /// The current value for single-selection mode.
    /// </summary>
    internal TValue? SelectedValue { get; init; }

    /// <summary>
    /// The current values for multiple-selection mode.
    /// </summary>
    internal IReadOnlyCollection<TValue> SelectedValues { get; init; } = [];

    /// <summary>
    /// Action to call when an item's pressed state changes.
    /// The item passes its value and its new pressed state.
    /// </summary>
    internal Func<TValue, bool, Task> OnItemToggled { get; init; }

    public ToggleGroupContext(
        bool multiple,
        bool groupDisabled,
        TValue? selectedValue,
        IReadOnlyCollection<TValue>? selectedValues,
        Func<TValue, bool, Task> onItemToggled)
    {
        Multiple = multiple;
        GroupDisabled = groupDisabled;
        SelectedValue = selectedValue;
        SelectedValues = selectedValues ?? [];
        OnItemToggled = onItemToggled ?? throw new ArgumentNullException(nameof(onItemToggled));
    }
}
