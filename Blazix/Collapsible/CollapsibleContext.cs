namespace Blazix.Collapsible;
internal sealed record CollapsibleContext
{
    /// <summary>
    /// A function to retrieve the actual, effective ID of the content panel.
    /// This ID should be used for aria-controls.
    /// </summary>
    internal Func<string?> GetEffectiveContentId { get; init; }

    /// <summary>
    /// A callback for the CollapsibleContent to report its effective ID to the root.
    /// </summary>
    internal Func<string?, Task> ReportEffectiveContentId { get; init; }
    internal bool IsDisabled { get; init; }
    internal bool IsOpen { get; init; }
    internal Func<Task> OnOpenToggleAsync { get; init; }

    public CollapsibleContext(
        Func<string?> getEffectiveContentId,
        Func<string?, Task> reportEffectiveContentId,
        bool isDisabled,
        bool isOpen,
        Func<Task> onOpenToggleAsync)
    {
        GetEffectiveContentId = getEffectiveContentId ?? throw new ArgumentNullException(nameof(getEffectiveContentId));
        ReportEffectiveContentId = reportEffectiveContentId ?? throw new ArgumentNullException(nameof(reportEffectiveContentId));
        IsDisabled = isDisabled;
        IsOpen = isOpen;
        OnOpenToggleAsync = onOpenToggleAsync ?? throw new ArgumentNullException(nameof(onOpenToggleAsync));
    }
}
