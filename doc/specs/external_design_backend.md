# 外部設計 (バックエンド)

本外部設計書には業務システム全体の基幹機能を構成する本体APIに関する設計のみを行う。

画面設計等はフロントエンド設計を参照のこと

## 目次

- アーキテクチャ設計

  - プラットフォーム設計

    - アーキテクチャ図
    - 本体API環境
    - その他プログラム
    - 使用ライブラリ

  - アプリケーション・アーキテクチャ設計

    - 機能構成

  - 開発標準

- アプリケーション設計

  - API構成

## アーキテクチャ設計

本項ではシステムのプラットフォーム設計、アプリケーション・アーキテクチャ設計、開発標準について記述する。

運用アーキテクチャ構成 大元の運用サーバーはWindows server 2016となるが、他環境での運用の場合はOSが変更になる場合がるため仮想環境での構築、運用を行う。

### プラットフォーム設計

#### アーキテクチャ図

[](TODOアーキテクチャ図の作成)

#### 本体API環境

項目      | 使用環境    | バージョン
:------ | :------ | :--------------
言語      | python3 | 3.6
データベース  | MySQL   | 5.6
Webサーバー | nginx   | 1.11.1-1~jessie
フレームワーク | Django  | 2.0.5

#### 使用ライブラリ

項目               | 使用環境                    | バージョン
:--------------- | :---------------------- | :-----
データベース連携         | PyMySQL                 | 0.8.1
REST API フレームワーク | Django rest framework   | 3.8.2
ログイン認証ライブラリ      | Djangorestframework-jwt | 1.11.0

### アプリケーション・アーキテクチャ設計

本項ではアプリケーション全体の構成を記述する。

#### アプリケーション機能構成

アプリケーションに置ける機能の構成について定義する。 

内容を大きく管理系と機能系に分けてリストアップする。

##### 管理系一覧

No   | 機能名          | RDD機能番号 | 機能詳細
:--- | :----------- | :------ | :-------------
M001 | システムマスタ管理    |         | システム基幹マスタの管理
M002 | 会社情報管理機能     | F006-1  | 会社情報の管理機能
M003 | ログインユーザー管理機能 | C003    | ログインユーザーの管理機能

##### 機能系一覧

No   | 機能名     | RDD機能番号 | 機能詳細
:--- | :------ | :------ | :---------------
F001 | 作業指図書管理 | F001    | 作業指図書登録、詳細、編集、削除
F002 | 部品表管理機能 | F002    | 部品表登録、詳細、編集、削除
F003 | 発注管理機能  | F003    | 発注関係の機能
F004 | 仕入管理機能  | F004    | 仕入関係の機能
F005 | 調査関係    | F005    | 調査関係の機能
F006 | マスタ関係   | F006    | マスタ関係の管理機能

##### 外部機能一覧

必要APIリストを列挙する。

各APIの詳細はアプリケーション設計にて後述する。

- システムマスタ

  - 国マスタ

    - 国一覧API
    - 国個別API

  - 通貨マスタ

    - 通貨一覧
    - 通貨個別API

  - 単位マスタ

    - 単位一覧API
    - 単位個別API

- ユーザーマスタ

  - 会社情報マスタ

    - 会社情報一覧API
    - 会社情報個別API

  - 従業員情報マスタ

    - 従業員一覧API
    - 会社別従業員一覧API
    - 従業員個別API

  - ログインユーザーマスタ

    - 会社別ログインユーザー一覧API
    - ログインユーザー個別API
    - JWTログインAPI
    - ログイン中ユーザー情報API

- ユーザー管理マスタ

  -

### 開発標準

#### API命名規則

Django REST Frameworkの仕様に準拠する。

#### 検索設定

各APIでの検索を行う際の出力設計を行う。

基本的にrest_frameworkの仕様及びdjango-filterを使用する。

##### ページング機能

- 基準ページサイズは50とする
- 制限はlimit,offsetを使用する

##### 検索設定

- 全文一致検索はカラムを指定する
- 前方一致等は?search=""で検索する

## アプリケーション設計

APIの構成や出力形式等を記載する。

### M001 システムマスタ管理

システム基幹マスタ情報を管理する部分であり、基本的にシステム管理者のみが操作する項目。 これらのマスタ情報の構成はユーザー毎に統一したものであると想定し、ユーザー毎のデータ保持は行わない。

API項目としては

- 国マスタ
- 通貨マスタ
- 単位マスタ である。

#### 国マスタ

ユーザー企業の所在国情報を司る部分であり、現時点では国名及び国コード(ISO 3166-1 alpha-2準拠)のみであるが、 将来的には税務的な情報等もここに追加する予定である。

##### 国マスタAPI出力

```json
[
    {
        "id": 1,
        "name": "Japan",
        "code": "JP",
        "created_at": "2018-09-01T12:00:00",
        "modified_at": "2018-09-01T12:00:00"
    },
    {
        "id": 2,
        "name": "United States of America",
        "code": "US",
        "created_at": "2018-09-01T12:00:00",
        "modified_at": "2018-09-01T12:00:00"
    }
]
```

#### 通貨マスタ

ユーザーが使用する通貨情報のマスタ部分であり、 各ユーザー企業は基軸通貨を設定し、それを基準として他の通貨のレートを保持することとする。

それに伴う通貨種別を記録するためのマスタデータをシステム上で保持する。

##### 通貨マスタAPI出力

```json
[
    {
        "id": 1,
        "name": "Japanese yen",
        "code": "JPY",
        "display": "¥",
        "decimal_point": 0,
        "created_at": "2018-09-01T12:00:00",
        "modified_at": "2018-09-01T12:00:00"
    },
    {
        "id": 2,
        "name": "United States Dollar",
        "code": "USD",
        "display": "$",
        "decimal_point": 2,
        "created_at": "2018-09-01T12:00:00",
        "modified_at": "2018-09-01T12:00:00"
    }
]
```

#### 単位マスタ

資材管理を行う際に記録単位や発注単位をシステム上のマスタとして登録し、データ整合性を保持する。

##### 単位マスタAPI出力

```json
[
    {
        "id": 1,
        "name": "quantity",
        "display": "qty",
        "created_at": "2018-09-01T12:00:00",
        "modified_at": "2018-09-01T12:00:00"
    }
]
```

### M002 会社情報管理機能

会社毎の従業員データや製品、資材関係の全てのデータが紐づく大元のユーザー情報を保持する。

人事及びユーザー情報の集約を行う。

API項目としては

- 会社情報マスタ
- 従業員情報マスタ である。

#### 会社情報マスタ

発注書等の帳票出力に使用する会社の基本情報をここに保存する。

##### 会社情報マスタAPI出力

```json
[
    {
        "id": 1,
        "country": 1,
        "name": "Admin company",
        "postal_code": "123-4567",
        "address": "Test, Admin, Address",
        "phone": "1234-56-7890",
        "fax": "1234-56-7891",
        "default_currency": 1,
        "created_at": "2018-09-03T12:00:00",
        "modified_at": "2018-09-03T12:00:00"
    }
]
```

特記事項

- "country"に国マスタのFKをはる
- "default_currency"に通貨マスタのFKをはる

#### 従業員情報マスタ

会社毎の従業員情報をここに保持し、基本的には資材管理システムの担当者情報やログインユーザー作成前の人員登録を行う想定である。

なお、システム利用ユーザー登録に関しては、

1. 管理者が従業員情報を登録する
2. ログインが必要な従業員には1に紐づく形でユーザーIDを作成する

というフローを想定している

##### 従業員情報マスタAPI出力

```json
[
    {
        "id": 1,
        "company": 1,
        "staff_number": 1,
        "full_name": "Administrator",
        "ruby": "Administrator",
        "mobile": "",
        "email": "",
        "postal_code": "",
        "address": "",
        "date_birth": null,
        "date_joined": null,
        "date_left": null,
        "is_login_user": true,
        "created_at": "2018-09-03T12:00:00",
        "modified_at": "2018-09-03T12:00:00"
    }
]
```

検索項目

- id(全文一致)
- company(全文一致)
- staff_number(全文一致)
- full_name(部分一致)
- ruby(部分一致)

特記事項

- "company"に会社情報マスタのFKをはる
- "staff_number"は社内での従業員番号を割り振る
- "is_login_user"がTrueの場合に限りログインユーザーを作成可能とする

従業員の個人情報などシステムの運用上データ構成が増加する可能性があるため、 ログイン情報とはOneToOneでModelを分割する。

### M003 ログインユーザー管理機能

システムへのログインユーザー情報を保持する。

認証方式としてはDjangoのカスタムユーザーModelで管理し、Django REST Framework JWTでのjwtトークン認証を行う。

#### ログインユーザーマスタ

APIでIDとPWを送り、認証された場合トークンを返却、フロントエンド側での認識はAPIヘッダーにトークンをいれて認証する。

このマスタではあくまで認証情報のみを取り扱うことを想定しているため、認証以外のデータは従業員情報のマスタに集約する。

##### ログインユーザーマスタAPI出力

```json
/// GET
[
    {
        "id": 1,
        "staff": 1,
        "username": "admin",
        "password": "pbkdf2_sha256$100000$2ErFy8c6e1Wc$Bi+XTpV5ClQkpxsNV5VmdRn1Es7x2m8qu3bgD+PvTbw=",
        "is_active": true,
        "is_staff": true,
        "created_at": "2018-09-05T17:58:23.052056",
        "modified_at": "2018-09-05T17:58:23.057043"
    }
]

/// JWTログインAPI
/// POST username,password
{
  "token": "xxxxxxxxxxxxトークンxxxxxxxxxxxx"
}
```

特記事項

- "staff"にはOneToOneで従業員情報のマスタのFKをはる
- "username"はシステム全体でユニーク
- "password"は暗号化して保存(Django機能)
- "is_active"がTrueになっている場合システムログイン可能
- "is_staff"がTrueになっている場合Django Adminサイトログイン可能
