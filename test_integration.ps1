#!/usr/bin/env pwsh
<#
Comprehensive integration test for EV Routing application
Tests both frontend and backend connectivity and functionality
#>

$ErrorActionPreference = 'Continue'

Write-Host "=" -NoNewline
Write-Host "=" * 60
Write-Host "🧪 Comprehensive EV Routing Integration Tests"
Write-Host "=" * 60

$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [int]$ExpectedStatus = 200
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = 'application/json'
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✅ $Name" -ForegroundColor Green
            $script:testResults += @{ Name = $Name; Status = "PASS"; Details = "Status: $($response.StatusCode)" }
            return $response
        } else {
            Write-Host "❌ $Name - Unexpected status: $($response.StatusCode)" -ForegroundColor Red
            $script:testResults += @{ Name = $Name; Status = "FAIL"; Details = "Status: $($response.StatusCode)" }
            return $null
        }
    }
    catch {
        Write-Host "❌ $Name - Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += @{ Name = $Name; Status = "FAIL"; Details = $_.Exception.Message }
        return $null
    }
}

# Test 1: Frontend Health
Write-Host "`n🌐 Testing Frontend..."
Test-Endpoint -Name "Frontend Health Check" -Url "http://localhost:3000/health"
Test-Endpoint -Name "Frontend Main Page" -Url "http://localhost:3000/"

# Test 2: Backend Health
Write-Host "`n🔧 Testing Backend..."
Test-Endpoint -Name "Backend Root Endpoint" -Url "http://localhost:8000/"
Test-Endpoint -Name "Backend Health Check" -Url "http://localhost:8000/api/health"

# Test 3: Backend Data Endpoints
Write-Host "`n📍 Testing Backend Data..."
$locations = Test-Endpoint -Name "Get Available Locations" -Url "http://localhost:8000/api/locations"
Test-Endpoint -Name "Get Driver Profiles" -Url "http://localhost:8000/api/driver-profiles"

# Test 4: Basic Routing
Write-Host "`n🛣️  Testing Basic Routing..."
$routeBody = @{
    origin = 'Amsterdam_Central'
    destination = 'Museumplein'
    driver_profile = 'eco'
    routing_model = 'dijkstra'
    battery_capacity_kwh = 60.0
    current_charge_kwh = 45.0
}
$routeResponse = Test-Endpoint -Name "Basic Route Calculation" -Url "http://localhost:8000/api/route" -Method "POST" -Body $routeBody

# Test 5: Different Routing Models
Write-Host "`n🔄 Testing Different Routing Models..."
foreach ($model in @('dijkstra', 'astar', 'multi_objective')) {
    $modelBody = $routeBody.Clone()
    $modelBody.routing_model = $model
    Test-Endpoint -Name "Route with $model model" -Url "http://localhost:8000/api/route" -Method "POST" -Body $modelBody
}

# Test 6: Different Driver Profiles  
Write-Host "`n👤 Testing Different Driver Profiles..."
foreach ($profile in @('eco', 'balanced', 'aggressive')) {
    $profileBody = $routeBody.Clone()
    $profileBody.driver_profile = $profile
    Test-Endpoint -Name "Route with $profile profile" -Url "http://localhost:8000/api/route" -Method "POST" -Body $profileBody
}

# Test 7: AI Enhancement
Write-Host "`n🤖 Testing AI Enhancement..."
$aiBody = @{
    origin = 'Amsterdam_Central'
    destination = 'West'
    driver_profile = 'eco'
    routing_model = 'dijkstra'
    battery_capacity_kwh = 30.0
    current_charge_kwh = 15.0
    use_ai_enhancement = $true
    preferences = @{}
}
Test-Endpoint -Name "AI Enhanced Route" -Url "http://localhost:8000/api/route" -Method "POST" -Body $aiBody

# Test 8: Route Comparison
Write-Host "`n📊 Testing Route Comparison..."
Test-Endpoint -Name "Compare Routes" -Url "http://localhost:8000/api/compare-routes" -Method "POST" -Body $routeBody

# Test 9: Error Handling
Write-Host "`n⚠️  Testing Error Handling..."
$invalidBody = @{
    origin = 'InvalidLocation'
    destination = 'AnotherInvalidLocation'
    driver_profile = 'eco'
}
Test-Endpoint -Name "Invalid Route Request" -Url "http://localhost:8000/api/route" -Method "POST" -Body $invalidBody -ExpectedStatus 400

# Test 10: Frontend-Backend Communication Test
Write-Host "`n🔗 Testing Frontend-Backend Communication..."
try {
    # Test if frontend can proxy to backend (through nginx)
    $proxyResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 10
    if ($proxyResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend-Backend Proxy Working" -ForegroundColor Green
        $testResults += @{ Name = "Frontend-Backend Proxy"; Status = "PASS"; Details = "Proxy successful" }
    }
} catch {
    Write-Host "❌ Frontend-Backend Proxy Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Name = "Frontend-Backend Proxy"; Status = "FAIL"; Details = $_.Exception.Message }
}

# Test Results Summary
Write-Host "`n" + "=" * 60
Write-Host "📊 Test Results Summary"
Write-Host "=" * 60

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $testResults.Count

Write-Host "Total Tests: $totalCount"
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red

if ($failCount -eq 0) {
    Write-Host "`n🎉 All tests passed! Integration successful!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Some tests failed. Details:" -ForegroundColor Red
    $testResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "   - $($_.Name): $($_.Details)" -ForegroundColor Red
    }
}

Write-Host "`n🐳 Docker Container Status:"
docker compose ps

Write-Host "`nIntegration testing completed."
exit ($failCount -eq 0 ? 0 : 1)
