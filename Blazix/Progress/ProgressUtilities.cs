namespace Blazix.Progress;

internal static class ProgressUtilities
{
    public static ProgressState GetProgressState(double? value, double maxValue)
    {
        if (!value.HasValue) return ProgressState.Indeterminate;

        // Using a small epsilon for floating point comparison
        if (Math.Abs(value.Value - maxValue) < 0.00001) return ProgressState.Complete;

        return ProgressState.Loading;
    }
}
