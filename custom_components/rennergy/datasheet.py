"""Heat pump datasheet: COP at operating points like A7/W35 and interpolation."""

from __future__ import annotations

from bisect import bisect_left
import re

_POINT = re.compile(
    r"A\s*(-?\d+(?:[.,]\d+)?)\s*/?\s*W\s*(\d+(?:[.,]\d+)?)\s*[=:]?\s*(\d+(?:[.,]\d+)?)",
    re.IGNORECASE,
)
# Minimum temperature lift used for the Carnot COP (avoids division by ~0).
_MIN_LIFT = 5.0

type Datasheet = list[tuple[float, float, float]]


def _num(text: str) -> float:
    return float(text.replace(",", "."))


def parse_datasheet(text: str) -> Datasheet:
    """Parse "A7/W35 = 4.8" style points (one per line or separated by ";").

    Raises ValueError if the text contains no valid point.
    """
    if not text.strip():
        return []
    points = [(_num(a), _num(w), _num(c)) for a, w, c in _POINT.findall(text)]
    if not points or any(c <= 0 for _, _, c in points):
        raise ValueError("no valid datasheet point")
    return points


def carnot_cop(flow: float, outdoor: float) -> float:
    """Ideal (Carnot) COP for heating to `flow` °C from `outdoor` °C."""
    return (flow + 273.15) / max(flow - outdoor, _MIN_LIFT)


def _interpolate(x: float, xs: list[float], ys: list[float]) -> float:
    """Linear interpolation, linear extrapolation outside the range."""
    if len(xs) == 1:
        return ys[0]
    i = min(max(bisect_left(xs, x), 1), len(xs) - 1)
    x0, x1, y0, y1 = xs[i - 1], xs[i], ys[i - 1], ys[i]
    return y0 + (y1 - y0) * (x - x0) / (x1 - x0)


def target_cop(points: Datasheet, outdoor: float, flow: float) -> float | None:
    """COP expected by the datasheet at the given outdoor / flow temperature."""
    if not points:
        return None
    by_flow: dict[float, dict[float, float]] = {}
    for a, w, c in points:
        by_flow.setdefault(w, {})[a] = c

    def along_outdoor(w: float) -> float:
        row = by_flow[w]
        xs = sorted(row)
        return _interpolate(outdoor, xs, [row[x] for x in xs])

    flows = sorted(by_flow)
    if len(flows) == 1:
        # Only one flow temperature known: scale with the Carnot COP.
        w0 = flows[0]
        cop = along_outdoor(w0) * carnot_cop(flow, outdoor) / carnot_cop(w0, outdoor)
    else:
        cop = _interpolate(flow, flows, [along_outdoor(w) for w in flows])
    return min(max(cop, 1.0), 10.0)
