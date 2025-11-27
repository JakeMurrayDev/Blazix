namespace Blazix.Tabs;

internal sealed record TabsContext(string BaseId,
                                   string? Value,
                                   Action<string?> OnValueChange,
                                   Orientation Orientation,
                                   ReadingDirection ReadingDirection,
                                   ActivationMode ActivationMode);