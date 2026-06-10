$url = "https://api.codetabs.com/v1/proxy?quest=https://web1.cmu.edu.tw/courseinfo/Home/Courselist"
Write-Host "Testing unencoded URL: $url"

try {
    $response = Invoke-WebRequest -Uri $url -TimeoutSec 15 -UseBasicParsing
    Write-Host "StatusCode: $($response.StatusCode)"
    $content = $response.Content
    Write-Host "Content Length: $($content.Length)"
    
    if ($content.Length -gt 100) {
        Write-Host "Sample Content: $($content.Substring(0, [Math]::Min(1000, $content.Length)))"
    } else {
        Write-Host "Content: $content"
    }
} catch {
    Write-Host "Error occurred: $_"
}
