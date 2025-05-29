using System.Globalization;

namespace Blazix.Services;

internal sealed class ReadingDirectionService(ReadingDirection? readingDirection = null) : IReadingDirectionService
{
    private static ReadingDirection GetReadingDirectionFromCulture() => CultureInfo.CurrentCulture.TextInfo.IsRightToLeft ? ReadingDirection.RightToLeft : ReadingDirection.LeftToRight;
    public ReadingDirection GetReadingDirection() => readingDirection ?? GetReadingDirectionFromCulture();
}

public interface IReadingDirectionService
{
    ReadingDirection GetReadingDirection();
}