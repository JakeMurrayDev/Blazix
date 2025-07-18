﻿using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;
using System.Diagnostics.CodeAnalysis;

namespace Blazix.Presence;

/// <summary>
/// A component that conditionally renders its child content with support for animations.
/// </summary>
public class Presence : ComponentBase, IAsyncDisposable
{
    private Lazy<Task<IJSObjectReference>> moduleTask = default!;
    private DotNetObjectReference<Presence>? dotNetObjectReference;
    private PresenceState state;
    private bool hasStateChangedSinceLastRender;

    private bool IsPresentInDom => state is PresenceState.Mounted or PresenceState.UnmountSuspended;

    [Inject]
    private IJSRuntime JSRuntime { get; set; } = default!;

    [Inject]
    private ILogger<Presence> Logger { get; set; } = default!;

    /// <summary>
    /// Gets or sets the HTML element tag to render.
    /// <para>
    /// Defaults to <c>div</c>.
    /// </para>
    /// </summary>
    [Parameter]
    public string As { get; set; } = "div";

    /// <summary>
    /// Gets or sets a value indicating whether the component is present.
    /// </summary>
    [Parameter, EditorRequired]
    public bool Present { get; set; }

    /// <summary>
    /// Defines the child components of this instance.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment<bool>? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }


    /// <summary>
    /// Gets or sets the associated <see cref="ElementReference"/>.
    /// <para>
    /// May be <see langword="null"/> if accessed before the component is rendered.
    /// </para>
    /// </summary>
    [DisallowNull]
    public ElementReference? Element { get; protected set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        dotNetObjectReference = DotNetObjectReference.Create(this);
        moduleTask = new(() => JSRuntime.InvokeAsync<IJSObjectReference>(
            "import", "./_content/Blazix/blazix-presence.js").AsTask());
        state = Present ? PresenceState.Mounted : PresenceState.Unmounted;
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        var wasPresent = state is PresenceState.Mounted;
        if (wasPresent != Present)
        {
            Send(Present ? PresenceEvent.Mount : PresenceEvent.AnimationOut);
        }
    }

    /// <inheritdoc />
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        if(IsPresentInDom)
        {
            builder.OpenElement(0, As);
            builder.AddMultipleAttributes(1, AdditionalAttributes);
            builder.AddElementReferenceCapture(2, capturedElement => Element = capturedElement);
            builder.AddContent(3, ChildContent?.Invoke(IsPresentInDom));
            builder.CloseElement();
        }
    }

    /// <inheritdoc />
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (hasStateChangedSinceLastRender && state == PresenceState.UnmountSuspended && Element.HasValue)
        {
            try
            {
                var module = await moduleTask.Value;
                await module.InvokeVoidAsync("checkForExitAnimationAndListen", Element, dotNetObjectReference);
            }
            catch (Exception ex) when (ex is JSDisconnectedException or TaskCanceledException) { /* Swallow */ }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Failed to check for exit animation.");
            }
        }
        hasStateChangedSinceLastRender = false;
    }

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        dotNetObjectReference?.Dispose();
        if (moduleTask.IsValueCreated)
        {
            try
            {
                var module = await moduleTask.Value;
                if (Element.HasValue)
                {
                    await module.InvokeVoidAsync("removePresenceEventListeners", Element);
                }
                await module.DisposeAsync();
            }
            catch (Exception ex) when (ex is JSDisconnectedException or TaskCanceledException) { /* Swallow */ }
        }
    }


    /// <summary>
    /// Invoked in javascript when the animation has completed.
    /// <remarks>
    /// Do not call this method directly.
    /// </remarks>
    /// </summary>
    [JSInvokable]
    public void OnAnimationEnd()
    {
        Send(PresenceEvent.AnimationEnd);
    }

    /// <summary>
    /// Invoked in javascript when the component has no animation.
    /// <remarks>
    /// Do not call this method directly.
    /// </remarks>
    /// </summary>
    [JSInvokable]
    public void UnmountImmediately()
    {
        Send(PresenceEvent.Unmount);
    }

    private void Send(PresenceEvent presenceEvent)
    {
        var nextState = (state, presenceEvent) switch
        {
            (PresenceState.Mounted, PresenceEvent.Unmount) => PresenceState.Unmounted,
            (PresenceState.Mounted, PresenceEvent.AnimationOut) => PresenceState.UnmountSuspended,
            (PresenceState.UnmountSuspended, PresenceEvent.Mount) => PresenceState.Mounted,
            (PresenceState.UnmountSuspended, PresenceEvent.AnimationEnd) => PresenceState.Unmounted,
            (PresenceState.UnmountSuspended, PresenceEvent.Unmount) => PresenceState.Unmounted,
            (PresenceState.Unmounted, PresenceEvent.Mount) => PresenceState.Mounted,
            _ => state
        };

        if (state != nextState)
        {
            state = nextState;
            hasStateChangedSinceLastRender = true;
            InvokeAsync(StateHasChanged);
        }
    }
}
