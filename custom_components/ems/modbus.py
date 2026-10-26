"""Minimal asyncio Modbus TCP client for the smart1 based Rennergy EMS.

The device only needs two function codes (0x04 read input registers and
0x10 write multiple registers), so a small dedicated client avoids depending
on a specific pymodbus version.
"""

from __future__ import annotations

import asyncio
from contextlib import suppress
import struct

FC_READ_INPUT = 0x04
FC_WRITE_MULTIPLE = 0x10


class ModbusError(Exception):
    """Communication with the device failed."""


class ModbusExceptionResponse(ModbusError):
    """The device answered with a Modbus exception code."""

    def __init__(self, code: int) -> None:
        super().__init__(f"Modbus exception code {code}")
        self.code = code


class SmartOneClient:
    """Modbus TCP client with a single persistent connection."""

    def __init__(
        self, host: str, port: int, unit_id: int, timeout: float = 5.0
    ) -> None:
        self.host = host
        self.port = port
        self.unit_id = unit_id
        self._timeout = timeout
        self._reader: asyncio.StreamReader | None = None
        self._writer: asyncio.StreamWriter | None = None
        self._lock = asyncio.Lock()
        self._tid = 0

    async def close(self) -> None:
        """Close the connection."""
        writer = self._writer
        self._reader = self._writer = None
        if writer is not None:
            writer.close()
            with suppress(Exception):
                await writer.wait_closed()

    async def read_input_registers(self, address: int, count: int) -> bytes:
        """Read `count` input registers and return the raw bytes."""
        data = await self._request(struct.pack(">BHH", FC_READ_INPUT, address, count))
        if not data or data[0] != count * 2 or len(data) < 1 + count * 2:
            raise ModbusError(f"Unexpected response length reading {address}")
        return data[1 : 1 + count * 2]

    async def read_floats(self, address: int, count: int) -> tuple[float, ...]:
        """Read `count` IEEE-754 floats (2 registers each)."""
        raw = await self.read_input_registers(address, count * 2)
        return struct.unpack(f">{count}f", raw)

    async def write_float(self, address: int, value: float) -> None:
        """Write one IEEE-754 float (2 registers in a single request)."""
        pdu = struct.pack(">BHHB", FC_WRITE_MULTIPLE, address, 2, 4) + struct.pack(
            ">f", value
        )
        await self._request(pdu)

    async def _request(self, pdu: bytes) -> bytes:
        async with self._lock:
            for attempt in (1, 2):
                try:
                    if self._writer is None:
                        self._reader, self._writer = await asyncio.wait_for(
                            asyncio.open_connection(self.host, self.port),
                            self._timeout,
                        )
                    return await asyncio.wait_for(self._transact(pdu), self._timeout)
                except ModbusExceptionResponse:
                    raise
                except (OSError, TimeoutError, asyncio.IncompleteReadError, ModbusError) as err:
                    await self.close()
                    if attempt == 2:
                        raise ModbusError(
                            f"Error talking to {self.host}:{self.port}: {err!r}"
                        ) from err
        raise ModbusError("unreachable")  # pragma: no cover

    async def _transact(self, pdu: bytes) -> bytes:
        assert self._reader is not None and self._writer is not None
        self._tid = self._tid % 0xFFFF + 1
        header = struct.pack(">HHHB", self._tid, 0, len(pdu) + 1, self.unit_id)
        self._writer.write(header + pdu)
        await self._writer.drain()

        while True:
            tid, _pid, length, _unit = struct.unpack(
                ">HHHB", await self._reader.readexactly(7)
            )
            body = await self._reader.readexactly(length - 1)
            if tid == self._tid:
                break  # skip stale answers of timed out requests

        function = body[0]
        if function & 0x80:
            raise ModbusExceptionResponse(body[1] if len(body) > 1 else 0)
        if function != pdu[0]:
            raise ModbusError(f"Unexpected function code {function}")
        return body[1:]
