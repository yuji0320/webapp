@echo off
setlocal

pushd "%~dp0"

rem バックアップファイルを何日分残しておくか（一ヶ月分）
set period=31
rem ファイル名を定義(※ファイル名で日付がわかるようにしておきます)
set datebase=%date%
set shortdate=%datebase:/=%
set shortdate=%shortdate:~2,6%

rem mysqldump実行
docker exec -it webapp_dev_mysql_1 mysqldump --single-transaction -uroot bms_backend > %shortdate%.dump


popd

exit /B 0