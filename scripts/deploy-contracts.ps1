# PowerShell script to deploy optimized contracts to Stellar Testnet and generate TS bindings.
$WorkspaceRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$BinDir = Join-Path $WorkspaceRoot "bin"
$StellarCli = Join-Path $BinDir "stellar.exe"

if (-not (Test-Path $StellarCli)) {
    $StellarCli = "stellar"
}

# 1. Setup Network
Write-Host "Configuring Stellar network: testnet..."
& $StellarCli network add --rpc-url https://soroban-testnet.stellar.org --passphrase "Test Horizon Network ; Public Sep 2015" testnet --global 2>$null

# 2. Setup Deployer Key
$AccountName = "deployer"
Write-Host "Verifying deployer key pair..."
$KeysList = & $StellarCli keys ls
$HasKey = $false
if ($KeysList) {
    foreach ($k in $KeysList) {
        if ($k.Trim() -eq $AccountName) {
            $HasKey = $true
            break
        }
    }
}
if (-not $HasKey) {
    Write-Host "Generating deployer key pair..."
    & $StellarCli keys generate $AccountName
    Write-Host "Funding deployer account with Friendbot..."
    & $StellarCli keys fund $AccountName --network testnet
} else {
    Write-Host "Deployer key found."
}

# 3. Deploy and Generate Bindings
$OptimizedDir = Join-Path $WorkspaceRoot "contracts\target\wasm32-unknown-unknown\release"
$DeploymentsFile = Join-Path $WorkspaceRoot "apps/web/src/generated/deployments.json"

# Ensure output folder for deployments exists
$DeploymentsDir = [System.IO.Path]::GetDirectoryName($DeploymentsFile)
if (-not (Test-Path $DeploymentsDir)) {
    New-Item -ItemType Directory -Path $DeploymentsDir | Out-Null
}

$Deployments = @{}
if (Test-Path $DeploymentsFile) {
    $DeploymentsObj = Get-Content $DeploymentsFile | ConvertFrom-Json
    if ($DeploymentsObj) {
        foreach ($prop in $DeploymentsObj.psobject.properties) {
            $Deployments[$prop.Name] = $prop.Value
        }
    }
}

# Contracts to deploy
$Contracts = @("counter")

foreach ($Contract in $Contracts) {
    $WasmPath = Join-Path $OptimizedDir "$($Contract).optimized.wasm"
    if (-not (Test-Path $WasmPath)) {
        Write-Host "Optimized WASM not found at $WasmPath, falling back to unoptimized..."
        $WasmPath = Join-Path $OptimizedDir "$($Contract).wasm"
    }

    if (-not (Test-Path $WasmPath)) {
        Write-Error "WASM file not found for $Contract."
        exit 1
    }

    Write-Host "Deploying $Contract to Testnet..."
    # Execute deployment and capture all streams to parse transaction links
    $DeployOutput = & $StellarCli contract deploy --wasm $WasmPath --source-account $AccountName --network testnet 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "$DeployOutput"
        Write-Error "Failed to deploy $Contract."
        exit 1
    }

    $ContractId = ""
    $WasmUploadUrl = ""
    $ContractDeployUrl = ""
    $TxUrls = @()

    foreach ($Line in $DeployOutput) {
        $LineStr = $Line.ToString().Trim()
        Write-Host $LineStr
        if ($LineStr -match "https://stellar.expert/explorer/testnet/tx/([a-f0-9]+)") {
            $TxUrls += $Matches[0]
        }
        # Stellar contract address is 56 uppercase alphanumeric chars starting with C
        if ($LineStr -match "^(C[A-Z2-7]{55})$") {
            $ContractId = $Matches[1]
        }
    }

    if ($TxUrls.Count -eq 2) {
        $WasmUploadUrl = $TxUrls[0]
        $ContractDeployUrl = $TxUrls[1]
    } elseif ($TxUrls.Count -eq 1) {
        $ContractDeployUrl = $TxUrls[0]
    }

    if (-not $ContractId) {
        # Fallback if regex match fails for any reason
        $ContractId = ($DeployOutput | Out-String).Trim()
        if ($ContractId -match "(C[A-Z2-7]{55})") {
            $ContractId = $Matches[1]
        }
    }

    Write-Host "Deployed $Contract successfully. ID: $ContractId"
    
    $DeployInfo = @{
        "contractId" = $ContractId
        "network" = "testnet"
    }
    if ($WasmUploadUrl) { $DeployInfo["wasmUploadUrl"] = $WasmUploadUrl }
    if ($ContractDeployUrl) { $DeployInfo["contractDeployUrl"] = $ContractDeployUrl }

    $Deployments[$Contract] = $DeployInfo

    # Generate TS bindings
    $OutputDir = Join-Path $WorkspaceRoot "packages/contracts/src/generated/$Contract"
    Write-Host "Generating TS client bindings for $Contract at: $OutputDir"
    if (Test-Path $OutputDir) {
        Remove-Item $OutputDir -Recurse -Force
    }
    
    # Run the stellar contract bindings command
    & $StellarCli contract bindings typescript --wasm $WasmPath --output-dir $OutputDir --overwrite
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to generate TypeScript bindings for $Contract."
        exit 1
    }
}

# Save deployment IDs
$DeploymentsJson = $Deployments | ConvertTo-Json
$DeploymentsJson | Out-File $DeploymentsFile -Encoding utf8
Write-Host "Deployments saved to: $DeploymentsFile"
