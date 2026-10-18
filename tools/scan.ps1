param([string]$Ip = "192.168.17.208", [int]$Start = 20000, [int]$End = 40000, [int]$Unit = 1)
# Read-only scan (function 0x04) of smart1 linear items, 100 registers per item.
$client = New-Object System.Net.Sockets.TcpClient($Ip, 502)
$stream = $client.GetStream(); $stream.ReadTimeout = 3000
$tid = 1
function Read-Input([int]$addr, [int]$count) {
    $script:tid = ($script:tid + 1) % 65535
    $req = [byte[]]@(($tid -shr 8), ($tid -band 255), 0, 0, 0, 6, $Unit, 4, ($addr -shr 8), ($addr -band 255), 0, $count)
    $stream.Write($req, 0, $req.Length)
    $hdr = New-Object byte[] 9; $n = 0
    while ($n -lt 9) { $n += $stream.Read($hdr, $n, 9 - $n) }
    if ($hdr[7] -ne 4) { $null = $stream.Read((New-Object byte[] 1), 0, 1); return $null }
    $len = $hdr[8]; $buf = New-Object byte[] $len; $n = 0
    while ($n -lt $len) { $n += $stream.Read($buf, $n, $len - $n) }
    return $buf
}
function F32($b, $o) { $x = [byte[]]@($b[$o+3], $b[$o+2], $b[$o+1], $b[$o]); [BitConverter]::ToSingle($x, 0) }
function Str($b, $o, $len) { ([System.Text.Encoding]::GetEncoding(28591).GetString($b, $o, $len)).Trim([char]0, ' ') }
function U16($b, $o) { $b[$o] * 256 + $b[$o+1] }

$hdr = Read-Input 0 3
if ($hdr) { "Version: $(U16 $hdr 0).$(U16 $hdr 2).$(U16 $hdr 4)" }
$sn = Read-Input 10 10; if ($sn) { "Serial: $(Str $sn 0 20)" }
$hw = Read-Input 20 20; if ($hw) { "HW: $(Str $hw 0 40)" }

for ($a = $Start; $a -lt $End; $a += 100) {
    $b = Read-Input $a 82
    if (-not $b) { continue }
    $name = Str $b 40 40
    $type = U16 $b 160; $sub = U16 $b 162
    if ($name -eq "" -and $type -eq 0) { continue }
    $unitType = Str $b 80 20; $baseUnit = Str $b 140 10; $key = Str $b 100 40
    "{0}`t{1}`tkey={9}`ttype={2} sub={3}`tval={4}`tunit={5}`tutype={6}`ttoday={7} total?={8}" -f $a, $name, $type, $sub, [math]::Round((F32 $b 0),2), $baseUnit, $unitType, [math]::Round((F32 $b 4),1), [math]::Round((F32 $b 12),1), $key
}
$client.Close()
