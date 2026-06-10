$proxies = @(
    @{ name = "CodeTabs (with slash)"; url = "https://api.codetabs.com/v1/proxy/?quest=" },
    @{ name = "CodeTabs (no slash)"; url = "https://api.codetabs.com/v1/proxy?quest=" },
    @{ name = "CorsProxy.io"; url = "https://corsproxy.io/?url=" },
    @{ name = "AllOrigins"; url = "https://api.allorigins.win/raw?url=" },
    @{ name = "CORS.lol"; url = "https://api.cors.lol/?url=" }
)

$targetUrl = "https://web1.cmu.edu.tw/courseinfo/Home/Courselist"

Write-Host "Testing different CORS Proxies against CMU course info website..."

foreach ($p in $proxies) {
    $encodedTarget = [Uri]::EscapeDataString($targetUrl)
    $url = $p.url + $encodedTarget
    Write-Host "`nTesting proxy: $($p.name)"
    Write-Host "Full URL: $url"
    
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 15 -UseBasicParsing
        Write-Host "StatusCode: $($response.StatusCode)"
        $content = $response.Content
        Write-Host "Content Length: $($content.Length)"
        
        if ($content -like "*dataTable*" -or $content -like "*課號*" -or $content -like "*課程名稱*") {
            Write-Host "Result: SUCCESS (found course keywords)"
        } else {
            Write-Host "Result: FAILED (keywords not found)"
            if ($content.Length -lt 500) {
                Write-Host "Content: $content"
            } else {
                Write-Host "Sample Content: $($content.Substring(0, 300))"
            }
        }
    } catch {
        Write-Host "Result: ERROR: $_"
    }
}
