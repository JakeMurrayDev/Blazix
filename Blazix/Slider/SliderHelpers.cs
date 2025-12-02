namespace Blazix.Slider;
internal static class SliderHelpers
{
    public static double ConvertValueToPercentage(double value, double min, double max)
    {
        var maxSteps = max - min;
        var percentPerStep = 100.0 / maxSteps;
        var percentage = percentPerStep * (value - min);
        return Math.Clamp(percentage, 0, 100);
    }
}
