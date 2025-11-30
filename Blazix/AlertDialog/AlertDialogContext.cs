using Microsoft.AspNetCore.Components;

namespace Blazix.AlertDialog;

internal sealed class AlertDialogContentContext
{
    public ElementReference? CancelElement { get; private set; }

    public void SetCancelElement(ElementReference? element) => CancelElement = element;
}