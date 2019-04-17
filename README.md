# 個別受注生産企業での原価計算資材管理システム

## 目次

- システム目的
- 構成
- デプロイ方法

## システム目的

本システムは個別受注生産企業における個別原価計算及び資材管理のシステムです。

所属企業の海外子会社でシステム運用の必要が出て来たので、
本社で使用しているシステムの海外、複数拠点対応のシステムを構築し、OSS として公開します。

使用目的は受注案件ごとの個別原価計算及び資材管理であり、あくまで既存の弊社システムの再構築となります。

製作者の本職が経理のため、プログラミング学習も兼ねて Github 上で公開ています。

## 構成

全体の構成としては

- バックエンドでは Django を使用し、REST framework による API で実装
- フロントエンドでは Vue.js を使用した非同期通信型のブラウザ上で利用
- ベースには Docker を使用して仮想環境で運用
- 社内ローカルサーバーにデプロイし運用はクローズドな環境を想定

となります。

詳細は別途[仕様書データ](/doc/specs/rdd.md)を参照ください。(作成中)

## デプロイ方法

Featuring:

- Docker Engine v18.06.1-ce
- Docker Compose v1.22.0
- Docker Machine v0.15.0
- Python 3.6

### OS X Instructions

1: Docker for mac をインストール

2: ディレクトリに移動し、ビルド

$ cd webapp
$ ./docker-compose.sh dev up --build

3: Django のデータベースを migrate

```$ docker exec -it <dev app container name or id> ./manage.py migrate

```

4: fixtures を読み込み初期データをインポート

```$ docker exec -it <dev app container name or id> ./manage.py loaddata initial_data.json
```

5: localhost にアクセス

### メモ

- initial data のエクスポート

```$ docker exec -it <dev app container name or id> ./manage.py dumpdata app名.model名 > 保存場所ファイルパス/ファイル名.json
```

#### データベースのバックアップ

mysqlのコンテナに入る

下記コマンドを入力

$ mysqldump --single-transaction -uroot bms_backend > ファイル保存先パス/ファイル名.dump

#### データベースの復元

- mysqlのコンテナに入る
- バックアップデータのある場所へ移動
- 下記コマンドを入力

$ mysql -u root -p bms_backend < ファイル名.dump