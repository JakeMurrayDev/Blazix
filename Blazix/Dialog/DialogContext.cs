using Microsoft.AspNetCore.Components;

namespace Blazix.Dialog;
internal sealed record DialogContext
{
    private readonly Func<bool, Task> onOpenChange;
    private readonly Func<Task> onOpenToggle;

    public string ContentId { get; }
    public string TitleId { get; }
    public string DescriptionId { get; }
    public bool Open { get; private set; }
    public bool Modal { get; }
    public string DataState => Open ? "open" : "closed";
    public ElementReference? TriggerElement { get; private set; }
    public ElementReference? ContentElement { get; private set; }

    public DialogContext(
        string contentId,
        string titleId,
        string descriptionId,
        bool open,
        bool modal,
        Func<bool, Task> onOpenChange,
        Func<Task> onOpenToggle)
    {
        ContentId = contentId;
        TitleId = titleId;
        DescriptionId = descriptionId;
        Open = open;
        Modal = modal;
        this.onOpenChange = onOpenChange;
        this.onOpenToggle = onOpenToggle;
    }

    public Task OnOpenChange(bool open) => onOpenChange(open);
    public Task OnOpenToggle() => onOpenToggle();

    public void SetTriggerElement(ElementReference? element) => TriggerElement = element;
    public void SetContentElement(ElementReference? element) => ContentElement = element;

    internal void UpdateOpen(bool open) => Open = open;
}

internal sealed record DialogPortalContext(bool ForceMount);