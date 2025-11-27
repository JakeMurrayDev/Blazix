using System;
using System.Collections.Generic;
using System.Text;

namespace Blazix.Tabs;

internal static class TabsHelper
{
    public static string MakeTriggerId(string baseId, string value)
    {
        return $"{baseId}-trigger-{value}";
    }

    public static string MakeContentId(string baseId, string value)
    {
        return $"{baseId}-content-{value}";
    }
}
