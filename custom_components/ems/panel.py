"""Sidebar panel of the Rennergy EMS."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant, callback

from .const import (
    DOMAIN,
    PANEL_COMPONENT,
    PANEL_STATIC_URL,
    PANEL_URL_PATH,
    VERSION,
)

_STATIC_REGISTERED = f"{DOMAIN}_static_registered"
_PANEL_REGISTERED = f"{DOMAIN}_panel_registered"


async def async_register_panel(hass: HomeAssistant) -> None:
    """Register the sidebar panel once for all config entries."""
    if hass.data.get(_PANEL_REGISTERED):
        return
    if not hass.data.get(_STATIC_REGISTERED):
        # Static paths cannot be removed again, so they stay for the session.
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    PANEL_STATIC_URL,
                    str(Path(__file__).parent / "frontend"),
                    cache_headers=False,
                )
            ]
        )
        hass.data[_STATIC_REGISTERED] = True

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=PANEL_COMPONENT,
        frontend_url_path=PANEL_URL_PATH,
        module_url=f"{PANEL_STATIC_URL}/ems-panel.js?v={VERSION}",
        sidebar_title="EMS",
        sidebar_icon="mdi:home-lightning-bolt",
        require_admin=False,
        config={},
    )
    hass.data[_PANEL_REGISTERED] = True


@callback
def async_unregister_panel(hass: HomeAssistant) -> None:
    if hass.data.pop(_PANEL_REGISTERED, False):
        frontend.async_remove_panel(hass, PANEL_URL_PATH)
