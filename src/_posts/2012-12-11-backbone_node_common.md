---
layout: posts
title: Backbone.jsでNode.jsとクライアントサイドのロジックをイケてる感じで共通化する
tags: 
  JavaScript
  Backbone.js
  Node.js
---

[Backbone.js Advent Calendar](http://www.adventar.org/calendars/15)の12日目です。

Backbone.jsを使ってNode.jsとクライアントサイドのJavaScriptでロジックを共有する方法について書いてみます。

Node.jsといえばチャット。チャットといえばSocket.IOということでSocket.IOを使ったチャットを例にしてみます。

例えばチャットの一回の文字列の上限を140文字にしたいとします。その場合クライアント側でもサーバー側でも同じバリデーションのロジックを実装するのは面倒ですし、上限値が変更になったときに2箇所変更するのはイケてないですね。

そこでBackbone.jsを使ってその部分のロジックを共通化してみます。

Backbone.jsはNode.jsでも使えるので次のようなmodelBase.jsというモデルを作ります。

{% highlight javascript %}
// modelBase.js

(function(root) {
  var Backbone = root.Backbone || require('backbone');

  var TEXT_LIMIT = 140;

  var MessageBase = Backbone.Model.extend({
    validate: function(attrs) {
      if (attrs.text.length >= TEXT_LIMIT) {
        return 'text is too long';
      }
    },

    // その他共通のロジック
  });

  var MessagesBase = Backbone.Collection.extend({
    // 共通のロジック
  });

  /**
   * Expose
   */
  root.MessagesBase = MessagesBase;
  root.MessageBase = MessageBase;
})(this);
{% endhighlight %}

イケてるポイントはここや

{% highlight javascript %}
var Backbone = root.Backbone || require('backbone');
{% endhighlight %}

ここでサーバーサイド、クライアントサイドのどちらでも使えるようにしてるところです。

{% highlight javascript %}
root.MessagesBase = MessagesBase;
root.MessageBase = MessageBase;
{% endhighlight %}


次にNode.js側でこのmodelBase.jsを継承したmodel.jsをつくります。

{% highlight javascript %}
// server: model.js
var modelBase = require('./modelBase');

var Message = modelBase.MessageBase.extend({
  // サーバー側のロジック
});

var Messages = modelBase.MessagesBase.extend({
  model: Message

  // サーバー側のロジック
});

module.exports.Messages = Messages;
{% endhighlight %}

そしてイケてるチャットアプリのapp.jsでmodel.jsで定義した`Messages`を使ってチャットのメッセージを管理します。

{% highlight javascript %}
// server: app.js

var io = require('socket.io').listen(3030);
var Messages = require('./model').Messages;
var messages = new Messages();

// modelBaseを静的ファイルとして配信
io.static.add('/modelBase.js', { file: __dirname + '/modelBase.js' });

io.sockets.on('connection', function(socket) {
  // なんかチャットのロジック

  socket.on('create', function(text) {
    // バリデーションが通ったらbroadcast（pushはバリデーションが通らなかったらfalseを返す）
    var model = messages.push({ text: text };
    if (model) {
      socket.broadcast.emit('update', model.toJSON());
    }
  });
});
{% endhighlight %}

ここでのイケてるポイントはこんな感じでmodelBase.jsを配信してることですね。

{% highlight javascript %}
// modelBaseを静的ファイルとして配信
io.static.add('/modelBase.js', { file: __dirname + '/modelBase.js' });
{% endhighlight %}

expressと併用してる場合などはそっちで配信してもいいと思います。

そうするとクライアント側では、次のようにmodelBase.jsを読み込むことができます。（Backbone.jsとかUnderscore.jsとかはこの前に読み込んでる前提）

{% highlight html %}
<script src="http://localhost:3030/socket.io/socket.io.js"></script>
<script src="http://localhost:3030/socket.io/modelBase.js"></script>
{% endhighlight %}

そうしたらクライアント側も同じようにmodelBaseを継承してモデルを実装することができます。

{% highlight javascript %}
// client: model.js
(function(root) {
  var Message = root.MessageBase.extend({
    // クライアント側のロジック
  });

  var Messages = root.MessagesBase.extend({
    model: Message,

    // クライアント側のロジック
  });

  root.Messages = Messages;
})(this);
{% endhighlight %}

{% highlight javascript %}
var messages = new Messages();

$('form').submit(function(e) {
  e.preventDefault();

  // createしたらイケてる感じでsocket.emitするようにしとく
  if (!messages.create({ text: $('input[type="text"]').val() })) {
    alert('バリデーションエラー！');
  }
});
{% endhighlight %}

このように簡単にロジックを共通化することができます。イケてますね。

また、Backbone.Syncをサーバー側ではRedisやmongodb、クライアント側ではsocketを使った処理に差し替えればさらにイケてるチャットアプリにすることができそうです。
