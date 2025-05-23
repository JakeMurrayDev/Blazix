using System.Globalization;

namespace Blazix;

internal static class AttributeUtilities
{
    public static string? CombineClassNames(IReadOnlyDictionary<string, object>? additionalAttributes, string? classNames)
    {
        if (additionalAttributes is null || !additionalAttributes.TryGetValue("class", out var @class))
        {
            return classNames;
        }

        var classAttributeValue = Convert.ToString(@class, CultureInfo.InvariantCulture);

        if (string.IsNullOrEmpty(classAttributeValue))
        {
            return classNames;
        }

        if (string.IsNullOrEmpty(classNames))
        {
            return classAttributeValue;
        }

        return $"{classAttributeValue} {classNames}";
    }

    public static string? CombineStyles(IReadOnlyDictionary<string, object>? additionalAttributes, string? styles)
    {
        if (additionalAttributes is null || !additionalAttributes.TryGetValue("style", out var style))
        {
            return styles;
        }

        var styleAttributeValue = Convert.ToString(style, CultureInfo.InvariantCulture);

        if (string.IsNullOrEmpty(styleAttributeValue))
        {
            return styles;
        }

        if (string.IsNullOrEmpty(styles))
        {
            return styleAttributeValue;
        }

        return $"{styleAttributeValue} {styles}";
    }

    /// <summary>
    /// Retrieves the 'id' from additional attributes or provides a default.
    /// </summary>
    /// <param name="additionalAttributes">The dictionary containing attributes.</param>
    /// <param name="defaultId">The default id to be returned if id attributes is empty.</param>
    /// <returns>The 'id' if found, otherwise the defaultId.</returns>
    public static string GetIdOrDefault(IReadOnlyDictionary<string, object>? additionalAttributes,
        string defaultId)
    {
        if (additionalAttributes?.TryGetValue("id", out var id) is true && id is string idAttributeValue &&
            !string.IsNullOrEmpty(idAttributeValue))
        {
            return idAttributeValue;
        }

        return defaultId;
    }
}
