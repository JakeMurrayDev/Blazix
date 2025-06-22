namespace Blazix.RadioGroup;

/// <summary>
/// Provides state and callbacks for a RadioGroup to its items.
/// </summary>
/// <typeparam name="TValue">The type of the value for the radio items.</typeparam>
internal sealed record RadioGroupContext<TValue>
{
    public string? Name { get; init; }
    public bool Required { get; init; }
    public bool IsGroupDisabled { get; init; }
    public TValue? SelectedValue { get; init; }
    public Func<TValue?, Task> OnValueChange { get; init; }

    public RadioGroupContext(
        string? name,
        bool required,
        bool isGroupDisabled,
        TValue? selectedValue,
        Func<TValue?, Task> onValueChange)
    {
        Name = name;
        Required = required;
        IsGroupDisabled = isGroupDisabled;
        SelectedValue = selectedValue;
        OnValueChange = onValueChange ?? throw new ArgumentNullException(nameof(onValueChange));
    }
}
