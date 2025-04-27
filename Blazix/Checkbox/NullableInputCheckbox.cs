using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Components;
using System.Diagnostics.CodeAnalysis;

namespace Blazix.Checkbox;

/// <summary>
/// An input component for editing nullable <see cref="bool"/> values.
/// </summary>
public sealed class NullableInputCheckbox : InputBase<bool?>
{
    /// <summary>
    /// Gets or sets the value given as data when submitted with a name.
    /// <para>
    /// Default value is "on".
    /// </para>
    /// </summary>
    [Parameter]
    public string ValueAttribute { get; set; } = "on";

    /// <summary>
    /// Gets or sets the associated <see cref="ElementReference"/>.
    /// <para>
    /// May be <see langword="null"/> if accessed before the component is rendered.
    /// </para>
    /// </summary>
    [DisallowNull] public ElementReference? Element { get; private set; }

    /// <inheritdoc />
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        builder.OpenElement(0, "input");
        builder.AddMultipleAttributes(1, AdditionalAttributes);
        builder.AddAttribute(2, "type", "checkbox");
        if (!string.IsNullOrEmpty(NameAttributeValue))
        {
            builder.AddAttribute(3, "name", NameAttributeValue);
        }
        builder.AddAttribute(4, "class", CssClass);
        builder.AddAttribute(5, "checked", BindConverter.FormatValue(CurrentValue));
        builder.AddAttribute(6, "value", ValueAttribute);
        builder.AddAttribute(7, "onchange", EventCallback.Factory.CreateBinder<bool?>(this, __value => CurrentValue = __value, CurrentValue));
        builder.SetUpdatesAttributeName("checked");
        builder.AddElementReferenceCapture(8, element => Element = element);
        builder.CloseElement();
    }

    /// <inheritdoc />
    protected override bool TryParseValueFromString(string? value, out bool? result, [NotNullWhen(false)] out string? validationErrorMessage)
        => throw new NotSupportedException($"This component does not parse string inputs. Bind to the '{nameof(CurrentValue)}' property, not '{nameof(CurrentValueAsString)}'.");
}
