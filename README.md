# ping-watcher
pingの値を監視します。

# 使い方
お好みの方法でcloneし、`config.json`を`config.json.example`に書かれた例のように編集してください。
その後、`yarn install`、または`npm i`でパッケージをインストールし、実行してください。
exampleにある設定では、
* 1秒おきに`1.1.1.1`へping
* 3回連続でpingに失敗、または`500ms`以上の値になった場合に送信
となっています。