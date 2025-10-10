namespace Blazix.Slider;

internal sealed record SliderValueContext(
    string? Name,
    bool Disabled,
    double Min,
    double Max,
    double Step,
    double[] Values,
    Orientation Orientation,
    ReadingDirection ReadingDirection,
    bool Inverted,
    string? Form,
    Func<int, string?> GetThumbId,
    Func<SliderThumb, int> RegisterThumb,
    Action<SliderThumb> UnregisterThumb,
    Action<int> FocusThumbAtIndex
);