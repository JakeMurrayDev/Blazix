namespace Blazix.Accordion;

/// <summary>
/// Provides state for a specific AccordionItem to its children (Header, Trigger, Content).
/// </summary>
internal sealed record AccordionItemContext
{
    /// <summary>
    /// The unique ID of the trigger element for this item.
    /// </summary>
    internal string TriggerId { get; init; }

    /// <summary>
    /// Indicates if the current item is open.
    /// </summary>
    internal bool IsOpen { get; init; }

    /// <summary>
    /// Indicates if the current item is disabled (either by itself or by the parent group).
    /// </summary>
    internal bool IsDisabled { get; init; }

    public AccordionItemContext(string triggerId, bool isOpen, bool isDisabled)
    {
        TriggerId = triggerId ?? throw new ArgumentNullException(nameof(triggerId));
        IsOpen = isOpen;
        IsDisabled = isDisabled;
    }
}
