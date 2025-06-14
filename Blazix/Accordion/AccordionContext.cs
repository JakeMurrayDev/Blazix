namespace Blazix.Accordion;

/// <summary>
/// Provides state and callbacks for an Accordion to its items.
/// </summary>
/// <typeparam name="TValue">The type of the value for the accordion items.</typeparam>
internal sealed record AccordionContext<TValue> : IAccordionContext
{
    /// <summary>
    /// Indicates if multiple items can be open simultaneously.
    /// </summary>
    public bool Multiple { get; init; }

    /// <summary>
    /// The orientation of the accordion.
    /// </summary>
    public Orientation GroupOrientation { get; init; }

    /// <summary>
    /// Indicates if an open item can be collapsed. Only applies to single-selection mode.
    /// </summary>
    public bool IsCollapsible { get; init; }

    /// <summary>
    /// Indicates if the entire accordion is disabled.
    /// </summary>
    public bool IsGroupDisabled { get; init; }

    /// <summary>
    /// The currently selected value in single-selection mode.
    /// </summary>
    public TValue? SelectedValue { get; init; }

    /// <summary>
    /// The currently selected values in multiple-selection mode.
    /// </summary>
    public IReadOnlyCollection<TValue> SelectedValues { get; init; } = [];

    /// <summary>
    /// A callback invoked when an item's state should be toggled.
    /// </summary>
    public Func<TValue, Task> OnItemToggle { get; init; }

    public AccordionContext(
        bool multiple,
        Orientation groupOrientation,
        bool isCollapsible,
        bool isGroupDisabled,
        TValue? selectedValue,
        IReadOnlyCollection<TValue>? selectedValues,
        Func<TValue, Task> onItemToggle)
    {
        Multiple = multiple;
        GroupOrientation = groupOrientation;
        IsCollapsible = isCollapsible;
        IsGroupDisabled = isGroupDisabled;
        SelectedValue = selectedValue;
        SelectedValues = selectedValues ?? [];
        OnItemToggle = onItemToggle ?? throw new ArgumentNullException(nameof(onItemToggle));
    }
}

internal interface  IAccordionContext
{
    /// <summary>
    /// The orientation of the accordion.
    /// </summary>
    Orientation GroupOrientation { get; }

    /// <summary>
    /// Indicates if an open item can be collapsed. Only applies to single-selection mode.
    /// </summary>
    bool IsCollapsible { get; }
}