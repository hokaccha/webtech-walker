---
title: 静的サイト開発ツールとしてのMiddlemanとGrunt
date: 2013-09-03 12:09 JST
tags:
  - middleman
  - grunt
---

最近自分の周りを見ると、フロントエンドの開発ツールといえばGruntをみんな使ってるんだけど、Middlemanを使うのもけっこういいんじゃないかと思ったので比較してみる。

## 実現したいこと

例えば次のようなものをつくりたいとする。

* HTMLは数ページ〜十数ページくらい（ヘッダ・フッタくらいは共通化したい）
* JSはconcatしてminifyしたい
* CSSはSassを使いたい
* 開発時はwatchしたり動的サーバーなりでJSやCSSは動的にビルドしたい
* 最終的には成果物として静的ファイルを出力したい

まあ、フロントエンドの開発ではいたって普通な要件だと思う。普段サーバーサイドの開発してたり、サーバーサイドと一緒にフロントエンドも開発してる人にとっては、静的ファイルだけ成果物としてあればいいとかあるの？と思うかもしれないけど自分の周りではけっこうよくある。

## Gruntとの比較について

このようなものを作りたいときにGruntとMiddlemanだったらどっちがいいかな？というのが今回の趣旨だけど、GruntとMiddlemanはアーキテクチャも思想もまったく違っていて、そもそも比較対象にならないのではというのは当然ある。

ただ今回のようなケースにおいてはどちらのツールを使っても実現できるため、どっちがいいかを比較てみようという感じ。

最終的にはMiddlemanがいいんじゃないかというのが自分の意見なんだけど、「それは今回のようなケースでは」という前提であって、Gruntのほうが柔軟で、できることは多いのでもっと複雑なことをしたい場合や、静的サイト開発以外の目的であればMiddlemanでは対応が難しいケースも多いと思う。

例えばjQueryで使わているみたいに、JavaScriptのライブラリをビルドするための使うのであればGruntが最適だろうと思う。

あとJekyllあたりも比較対象にはなるんだけど今回は割愛。

## Gruntの場合

それぞれでほぼ同じような挙動になるようにして設定したのをGitHubに上げた。まずGruntはこんな感じ。

[hokaccha/frontend-dev-env/grunt - GitHub](https://github.com/hokaccha/frontend-dev-env/tree/master/grunt)

Gruntfile.jsは次のようになっている。

```javascript
module.exports = function(grunt) {

  BUILD_DIR = 'build';
  SRC_DIR = 'source';

  grunt.task.loadNpmTasks('assemble');
  grunt.task.loadNpmTasks('grunt-contrib-sass');
  grunt.task.loadNpmTasks('grunt-contrib-concat');
  grunt.task.loadNpmTasks('grunt-contrib-uglify');
  grunt.task.loadNpmTasks('grunt-contrib-copy');
  grunt.task.loadNpmTasks('grunt-contrib-clean');
  grunt.task.loadNpmTasks('grunt-contrib-connect');
  grunt.task.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    assemble: {
      options: {
        layout: SRC_DIR + '/layouts/layout.hbs'
      },
      dist: {
        expand: true,
        cwd: SRC_DIR,
        src: '*.hbs',
        dest: BUILD_DIR
      }
    },
    sass: {
      options: {
        bundleExec: true
      },
      dist: {
        files: [
          {
            src: SRC_DIR + '/css/app.scss',
            dest: BUILD_DIR + '/css/app.css'
          }
        ]
      }
    },
    concat: {
      dist: {
        src: [
          SRC_DIR + '/js/lib/jquery.js',
          SRC_DIR + '/js/lib/underscore.js',
          SRC_DIR + '/js/lib/backbone.js',
          SRC_DIR + '/js/app/main.js',
        ],
        dest: BUILD_DIR + '/js/app.js',
      },
    },
    uglify: {
      dist: {
        files: {
          'build/js/app.js': BUILD_DIR + '/js/app.js'
        }
      }
    },
    copy: {
      dist: {
        expand: true,
        cwd: SRC_DIR + '/img',
        src: '**/*',
        dest: BUILD_DIR + '/img'
      }
    },
    clean: [BUILD_DIR],
    connect: {
      server: {
        options: {
          port: process.env.PORT || 3000,
          base: BUILD_DIR
        }
      }
    },
    watch: {
      assemble: {
        files: [SRC_DIR + '/*.hsb', SRC_DIR + '/layouts/*'],
        tasks: 'assemble'
      },
      sass: {
        files: SRC_DIR + '/css/*',
        tasks: 'sass'
      },
      js: {
        files: SRC_DIR + '/js/**/*',
        tasks: 'concat'
      },
      copy: {
        files: SRC_DIR + '/img/**/*',
        tasks: 'copy'
      }
    }
  });

  grunt.registerTask('build', ['clean', 'concat', 'uglify', 'sass', 'assemble', 'copy']);
  grunt.registerTask('server', ['clean', 'concat', 'sass', 'assemble', 'copy', 'connect', 'watch']);
  grunt.registerTask('default', ['build']);
};
```

お、おう、これはすごい。力作。正直このエントリ書くのにこのGruntfile書くのが一番時間かかった。やはりGruntは色々なものを組みわせて柔軟に書ける反面、自分でプラグインを選んで手動で設定行わなければいけないというのが難点だと思う。長くなるし複雑になる。

Grunt力は正直あんまり高くないほうだと思うのでもっとうまく書けるのかもしれないけど。あとGrunefileをCoffeeで書けば多少は短くなるだろうけど本質は変わらないね。

ちなみに少しだけ中の解説をすると、テンプレートエンジンからHTMLにレンダリングしたりlayout的な機能を提供する[Assemble](http://assemble.io/)というのを使ってる。これはこれで便利。他はほとんど`grunt-contrib-*`なのでほぼGruntのベーシックな機能しか使ってない。

## Middleman

一方Middleman。

[hokaccha/frontend-dev-env/middleman - GitHub](https://github.com/hokaccha/frontend-dev-env/tree/master/middleman)

設定ファイルであるconfig.rbはこんな感じ。

```ruby
set :css_dir, 'css'
set :js_dir, 'js'

configure :development do
  set :debug_assets, true
end

configure :build do
  activate :minify_javascript
end
```

Gruntに比べると超シンプル。プラグインも一個も入れてない。

Middlemanがいいと思うところをいくつか紹介してみる。

### Asset Pipeline

なんといってもこれが一番大きい。Asset Pipeline。

例えば以下のようにJavaScript内で`require`と書くことができ、

```javascript
//= require _lib/jquery
//= require _lib/underscore
//= require _lib/backbone
//= require _app/main.js
```

これが開発時にはHTMLで次のように展開される。（?body=1というのはrequireを無視するというクエリ）

```html
<script src="/js/_lib/jquery.js?body=1"></script>
<script src="/js/_lib/underscore.js?body=1"></script>
<script src="/js/_lib/backbone.js?body=1"></script>
<script src="/js/_app/main.js?body=1"></script>
<script src="/js/app.js?body=1"></script> 
```

本番環境（というか静的ファイル出力時）には次のようになって、concatされてminifyされた状態のapp.jsが出力される。

```html
<script src="/js/app.js"></script> 
```

これは開発時にはすごく便利で、開発時だけminifyされてないしconcatもされてないので、かなり開発しやすい。Source Mapで将来的には解決する問題だとは思うけど現時点ではかなり現実的でよい方法だと思う。

SassもこのAsset Pipelineという機能がコンパイルしてる。あとCoffeeScriptなんかもプラグイン入れたり設定変えたりしなくても、拡張子を`.coffee`にするだけでコンパイルできる。

### relative links

他にも静的ファイルをつくる上で嬉しい機能がいくつかある。例えば`link_to`。layoutに

```erb
<li><%= link_to 'About', '/about.html' %></li>
```

と書いてる場合、リンクは通常絶対パスになるが、要件によってはファイルを設置するパスが決まっておらず相対パスのほうが都合がいいような場合もあるけど、HTMLが階層をまたぐときにめんどくさい。

そんなとき、`link_to`ヘルパーを使っていると、設定で`set :relative_links, true`とすれば、自動的にHTMLの階層を見て相対パスに書き換えてくれたりする。

例えば、`/index.html`ではリンク先が`about.html`になるけど、`/dir/page.html`からは`../about.html`になるような感じ。

リンクだけじゃなくてscript要素やlink要素の参照先も設定すれば相対パスになる。これは地味にうれしい機能。

### 動的サーバー

Gruntはどうしてもその性質からwatchしてコンパイルという手順を踏まないといけないので、ラグがでて、編集してリロードするとまだファイルができてないとかあってイライラすることがある。

一方、Middlemanは開発時は動的サーバーなのでそれがない。しかもRackのMiddlewareを差し込めるため既存の資産が使えて嬉しかったりする。

まあこの辺はLiveReloadとかGlowlの通知とか使えばどうにかなるのかもしれないけどちょっとそこまでは試してない。（ちなみにLiveReloadのプラグインはMiddlemanの公式にある）

## まとめ

Middleman推しまくりになってしまったけど、別にGruntをdisってるわけじゃないというのは最後に付け加えておく。むしろGruntは素晴らしいツールだと思うし今後もっと使われるようになると思う。

だけど、今回のような特定のケースではそれに特化したツールがあればそっちを使う方が色々と便利なことが多いんじゃないだろうか、という一つの提案でした。
