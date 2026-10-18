param([string]$Ip = "192.168.17.208", [int[]]$Items = @(20300, 20600, 30200, 29000), [int]$Unit = 1)
# Read-only dump of the float registers of single items (function 0x04).
$client = New-Object System.Net.Sockets.TcpClient($Ip, 502)
$stream = $client.GetStream(); $stream.ReadTimeout = 3000
function Read-Regs([int]$fc, [int]$addr, [int]$count) {
    $req = [byte[]]@(0, 1, 0, 0, 0, 6, $Unit, $fc, ($addr -shr 8), ($addr -band 255), 0, $count)
    $stream.Write($req, 0, $req.Length)
    $hdr = New-Object byte[] 9; $n = 0
    while ($n -lt 9) { $n += $stream.Read($hdr, $n, 9 - $n) }
    if ($hdr[7] -ne $fc) { return "EXC $($hdr[8])" }
    $len = $hdr[8]; $buf = New-Object byte[] $len; $n = 0
    while ($n -lt $len) { $n += $stream.Read($buf, $n, $len - $n) }
    return $buf
}
function F32($b, $o) { $x = [byte[]]@($b[$o+3], $b[$o+2], $b[$o+1], $b[$o]); [BitConverter]::ToSingle($x, 0) }
foreach ($sa in $Items) {
    $b = Read-Regs 4 $sa 20
    $vals = for ($i = 0; $i -lt 20; $i += 2) { "r{0}={1}" -f $i, [math]::Round((F32 $b ($i*2)), 2) }
    "$sa input : $($vals -join '  ')"
    $c = Read-Regs 4 ($sa + 80) 14
    if ($c -is [string]) { "$sa input 80-93: $c" } else { "$sa input 80-93: " + (($c | ForEach-Object { $_.ToString('x2') }) -join '') + "  f90=$([math]::Round((F32 $c 20),2)) f92=$([math]::Round((F32 $c 24),2))" }
    $h = Read-Regs 3 ($sa + 90) 4
    if ($h -is [string]) { "$sa holding 90-93: $h" } else { "$sa holding 90-93: f90=$([math]::Round((F32 $h 0),2)) f92=$([math]::Round((F32 $h 4),2))" }
}
$client.Close()
