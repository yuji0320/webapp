#個別受注生産企業での原価計算資材管理システム

## 目次

- システム目的
- 構成
- デプロイ方法

## システム目的

本システムは個別受注生産企業における個別原価計算及び資材管理のシステムです。

所属企業の海外子会社でシステム運用の必要が出て来たので、
本社で使用しているシステムの海外、複数拠点対応のシステムを構築し、OSSとして公開します。

使用目的は受注案件ごとの個別原価計算及び資材管理であり、あくまで既存の弊社システムの再構築となります。

製作者の本職が経理のため、プログラミング学習も兼ねてGithub上で公開ています。

## 構成

全体の構成としては

 - バックエンドではDjangoを使用し、REST frameworkによるAPIで実装
 - フロントエンドではVue.jsを使用した非同期通信型のブラウザ上で利用
 - ベースにはDockerを使用して仮想環境で運用
 - 社内ローカルサーバーにデプロイし運用はクローズドな環境を想定

となります。

詳細は別途[仕様書データ](/doc/specs/rdd.md)を参照ください。(作成中)

##  デプロイ方法

Featuring:

- Docker Engine v18.06.1-ce
- Docker Compose v1.22.0
- Docker Machine v0.15.0
- Python 3.6

### OS X Instructions

1: Docker for mac をインストール

2: ディレクトリに移動し、ビルド

```
$ cd webapp
$ ./docker-compose.sh dev up --build
```

3: Djangoのデータベースをmigrate

```
$ docker exec -it <dev app container name or id> ./manage.py migrate
```

4: fixturesを読み込み初期データをインポート


```
$ docker exec -it <dev app container name or id> ./manage.py loaddata initial_data.json
```

5: localhostにアクセス
