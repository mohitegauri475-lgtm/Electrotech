@echo off
echo =====================================================================
echo Configuring SQL Server Express (SQLEXPRESS) for Spring Boot
echo - Enabling Mixed Mode Authentication (SQL + Windows Auth)
echo - Enabling TCP/IP Protocol on Port 1433
echo - Starting SQL Server Browser Service
echo - Restarting SQL Server Service
echo =====================================================================

:: Check for administrative privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo [!] Administrator privileges required.
    echo [!] Please right-click 'enable-sql-tcp.bat' and select 'Run as administrator'.
    echo.
    pause
    exit /b 1
)

echo [*] Enabling Mixed Mode Authentication (LoginMode = 2)...
reg add "HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer" /v LoginMode /t REG_DWORD /d 2 /f

echo [*] Enabling TCP/IP protocol...
reg add "HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp" /v Enabled /t REG_DWORD /d 1 /f

echo [*] Setting TCP Port to 1433 on all IP addresses...
reg add "HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp\IPAll" /v TcpPort /t REG_SZ /d "1433" /f
reg add "HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp\IPAll" /v TcpDynamicPorts /t REG_SZ /d "" /f

echo [*] Configuring and Starting SQL Server Browser service...
sc config SQLBrowser start= auto >nul 2>&1
net start SQLBrowser >nul 2>&1

echo [*] Restarting SQL Server (SQLEXPRESS)...
net stop "MSSQL$SQLEXPRESS" >nul 2>&1
net start "MSSQL$SQLEXPRESS"

echo.
echo =====================================================================
echo [SUCCESS] SQL Server Express is fully configured!
echo - Mixed Mode Auth (sa / GiftEdit@123456) enabled
echo - TCP/IP enabled on port 1433
echo =====================================================================
echo You can now hit 'Run' in IntelliJ IDEA or run the Spring Boot backend!
echo.
pause
