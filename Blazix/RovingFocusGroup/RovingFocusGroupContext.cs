namespace Blazix.RovingFocusGroup;

internal interface IRovingFocusGroupContext
{
    Orientation Orientation { get; }
    ReadingDirection ReadingDirection { get; }
    bool Loop { get; }
    string? CurrentTabStopId { get; }
    void OnItemFocus(string tabStopId);
    void OnItemShiftTab();
    void RegisterItem(RovingFocusGroupItem item);
    void UnregisterItem(RovingFocusGroupItem item);
    RovingFocusGroupItem[] GetFocusableItems();
}

internal sealed record RovingFocusGroupContext(
    Orientation Orientation,
    ReadingDirection ReadingDirection,
    bool Loop,
    string? CurrentTabStopId,
    Action<string> OnItemFocus,
    Action OnItemShiftTab,
    Action<RovingFocusGroupItem> RegisterItem,
    Action<RovingFocusGroupItem> UnregisterItem,
    Func<RovingFocusGroupItem[]> GetFocusableItems) : IRovingFocusGroupContext
{
    void IRovingFocusGroupContext.OnItemFocus(string tabStopId) =>
        OnItemFocus(tabStopId);

    void IRovingFocusGroupContext.OnItemShiftTab() =>
        OnItemShiftTab();

    void IRovingFocusGroupContext.RegisterItem(RovingFocusGroupItem item) =>
        RegisterItem(item);

    void IRovingFocusGroupContext.UnregisterItem(RovingFocusGroupItem item) =>
        UnregisterItem(item);

    RovingFocusGroupItem[] IRovingFocusGroupContext.GetFocusableItems() =>
        GetFocusableItems();
}

internal record RovingFocusGroupItemContext(
    bool IsCurrentTabStop,
    bool HasTabStop);