using System.ComponentModel;

namespace Blazix;

/// <summary>
/// Represents the possible orientations of an element.
/// </summary>
public enum Orientation
{
    /// <summary>
    /// The orientation is undefined.
    /// </summary>
    Undefined,
    /// <summary>
    /// The orientation is horizontal.
    /// </summary>
    Horizontal,
    /// <summary>
    /// The orientation is vertical.
    /// </summary>
    Vertical
}

/// <summary>
/// Represents the possible reading directions of text.
/// </summary>
public enum ReadingDirection
{
    /// <summary>
    /// The reading direction is undefined.
    /// </summary>
    Undefined,
    /// <summary>
    /// The reading direction is left to right.
    /// </summary>
    LeftToRight,
    /// <summary>
    /// The reading direction is right to left.
    /// </summary>
    RightToLeft
}

internal static class EnumExtensions
{
    /// <summary>
    /// Converts an Orientation to a corresponding value of data attribute.
    /// </summary>
    /// <param name="orientation">The orientation to convert.</param>
    /// <returns>The data string representation of the orientation.</returns>
    /// <exception cref="InvalidEnumArgumentException"></exception>
    public static string ToDataAttributeString(this Orientation orientation) =>
        orientation switch
        {
            Orientation.Undefined => "undefined",
            Orientation.Horizontal => "horizontal",
            Orientation.Vertical => "vertical",
            _ => throw new InvalidEnumArgumentException(nameof(orientation), (int)orientation, typeof(Orientation))
        };

    /// <summary>
    /// Converts a ReadingDirection to corresponding value of data attribute.
    /// </summary>
    /// <param name="readingDirection">The reading direction to convert.</param>
    /// <returns>The data string representation of the reading direction.</returns>
    /// <exception cref="InvalidEnumArgumentException"></exception>
    public static string ToDataAttributeString(this ReadingDirection readingDirection) =>
        readingDirection switch
        {
            ReadingDirection.Undefined => "undefined",
            ReadingDirection.LeftToRight => "ltr",
            ReadingDirection.RightToLeft => "rtl",
            _ => throw new InvalidEnumArgumentException(nameof(readingDirection), (int)readingDirection, typeof(ReadingDirection))
        };
}
