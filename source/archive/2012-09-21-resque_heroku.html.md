---
title: HerokuでResqueを使うときに優雅に再起動する
tags:
  - Ruby
  - heroku
---

Ruby製のジョブキューサーバーである[Resque](https://github.com/defunkt/resque)はHerokuのWorkerプロセスで動かそうとすると一つ問題があった。

シグナルハンドリングの問題なんだけど、Herokuはworkerプロセスを再起動するときに`SIGTERM`を送り、プロセスが終了したら再度プロセスを起動する。`SIGTERM`を送ってworkerが10秒間プロセスが終了しなかったら`SIGKILL`で強制終了させる。のでworker側は`SIGTERM`を受け取ったら10秒以内に安全に（今あるジョブを終了するなりなんなりして）プロセスを終了する必要がある。

そのようなHerokuの挙動は以下に書いてある。

[Managing Heroku Processes \| Heroku Dev Center](https://devcenter.heroku.com/articles/dynos#graceful-shutdown-with-sigterm)

一方で、Resqueのシグナルハンドリングがどうなっているかというと、`SIGTERM`で強制終了するようになってる。

[resque/README.markdown at 1-x-stable · defunkt/resque](https://github.com/defunkt/resque/blob/1-x-stable/README.markdown#signals)

なのでHerokuでResqueを使った場合、再起動するときに安全にプロセスが再起動できないという問題があったというわけ。

なのでこんな感じのforkしてシグナルハンドリングの部分だけパッチ当てたやつとかもあった。

[mjezzi/resque-cedar · GitHub](https://github.com/mjezzi/resque-cedar)

で、それがResqueの1.22.0で解決されたみたい。

1.22.0では`TERM_CHILD=1`というのを環境変数で設定すればマスタプロセスが`SIGTERM`を受け取ったときに、起動している子プロセスに対して`SIGTERM`を送り、子プロセスが`RESQUE_TERM_TIMEOUT`で設定された秒数の間に終了しなかったら子プロセスに`SIGKILL`を送って強制終了させるという機能が実装された。これによって

    $ TERM_CHILD=1 RESQUE_TERM_TIMEOUT=10 QUEUES=* rake resque:work

のように起動し、worker側で`SIGTERM`をハンドリングすることで安全に再起動できるようになる。

## 試してみる

```ruby
# worker.rb

require 'resque/errors'

class SampleWork
  @queue = :test

  def self.perform
    sleep 10
    puts 'complete job!'
  rescue Resque::TermException
    sleep 2
    puts 'graceful shutdown!'
  end
end
```

```ruby
# clinet.rb

require 'resque'
require './worker'

Resque.enqueue SampleWork
```

```ruby
# Rakefile

require 'resque/tasks'
require './worker'
```

こんな感じのworkerをつくって試してみる。`Resque::TermException`という例外でResqueからの`SIGTERM`をキャッチできるようなのでこのworkerは`SIGTERM`を受け取ったら2秒待って文字列を出力した後終了することが期待される。

まずは普通にworkerを起動してみる。

    $ QUEUES=* rake resque:work                       

この状態でclinet.rbでジョブを登録して10秒以内にResqueのマスタプロセスに対して`SIGTERM`を送る。

    $ kill -TERM {pid}

そしたら起動していたワーカープロセスは何も出力されずに終了した。これは`SIGTERM`を受け取ったら強制終了というResqueのドキュメントに書いてある挙動なので正しい。

次に`TERM_CHILD`と`RESQUE_TERM_TIMEOUT`を指定して起動してみる。

    $ TERM_CHILD=1 RESQUE_TERM_TIMEOUT=10 QUEUES=* rake resque:work

同じようにclinet.rbでジョブを登録して10秒以内にResqueのマスタプロセスに対して`SIGTERM`を送る。そうすると2秒後に

    $ TERM_CHILD=1 RESQUE_TERM_TIMEOUT=10 QUEUES=* rake resque:work
    graceful shutdown!

となってプロセスが終了して期待通り動いた。

次に`RESQUE_TERM_TIMEOUT=1`としてタイムアウトを1秒に指定する。

    $ TERM_CHILD=1 RESQUE_TERM_TIMEOUT=1 QUEUES=* rake resque:work

これで同じようにジョブを登録して`SIGTERM`を送ったら何も出力されずに終了した。sleepが2秒でタイムアウトが1秒なので`SIGTERM`のハンドリングで終了するより先にタイムアウトして終了したことがわかる。

Resque 2.xではこれがデフォルトになるとかなんとか（要確認）。

### 参考

* [Queuing in Ruby with Redis and Resque \| Heroku Dev Center](https://devcenter.heroku.com/articles/queuing-ruby-resque)
* [hone.heroku.com \| Resque Signals](http://hone.heroku.com/resque/2012/08/21/resque-signals.html)
