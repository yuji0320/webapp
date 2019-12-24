#!/usr/bin/bash

# 他のユーザからバックアップを読み込めないようにする
# umask 077

# バックアップファイルを何日分残しておくか（一ヶ月分）
period=31
# バックアップファイルを保存するディレクトリ
dirpath='/tmp/backup'

# ファイル名を定義(※ファイル名で日付がわかるようにしておきます)
filename=`date +%y%m%d`

# mysqldump実行（ファイルサイズ圧縮の為gzで圧縮しておきます。）
# mysqldump --opt --all-databases --events --default-character-set=binary -u root | gzip > $dirpath/$filename.sql.gz
mysqldump --single-transaction -uroot bms_backend > $dirpath/$filename.dump

# 古いバックアップファイルを削除
oldfile=`date --date "$period days ago" +%y%m%d`
rm -f $dirpath/$oldfile.dump