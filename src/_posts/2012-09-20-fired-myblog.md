---
layout: posts
title: 俺の最強ブログシステムも火を噴いてたぜ
tags: blog
---

[俺の最強ブログ システムが火を噴くぜ - てっく煮ブログ](http://tech.nitoyon.com/ja/blog/2012/09/20/moved-completed/)

これとJekyll、DISQUS、Githubを使ってるところあたりはほとんど同じだった。

元記事がレンタルサーバーにデプロイしてるのに対してこっちはgithub pagesにデプロイしてる。サーバーも用意しなくていいからお手軽かつ最強だぜ〜。

ただgithub pagesに直接Jekyllのソース上げるとplugin使えなかったりして不便なんでJekyllで生成した静的ファイルをgh-pagesブランチにコミットしていて

* [masterブランチ](https://github.com/hokaccha/webtech-walker) -> ソース
* [gh-pagesブランチ](https://github.com/hokaccha/webtech-walker/tree/gh-pages) -> 生成したファイル

ってしてるんだけど、いちいちブランチ切り替えてなんちゃらしたりhookスクリプトでほげほげするのは面倒なんで

    $ rale deploy

ってやるとJekyllのビルドが走って生成したファイルコピーしてgh-pagesにコミットしてGithubにpushするところまで自動でできるようにしてる。ビルドタスクはこんな感じ。

[webtech-walker/Rakefile at f2b178baa3bb00776f089f50b7b3e2954c83694c · hokaccha/webtech-walker](https://github.com/hokaccha/webtech-walker/blob/f2b178baa3bb00776f089f50b7b3e2954c83694c/Rakefile#L10-20)
{% highlight ruby %}
desc 'deploy to production'
task :deploy do
  sh 'bundle exec jekyll'
  sh 'rm -rf _deploy/*'
  sh 'cp -R _site/* _deploy'
  cd '_deploy' do
    sh 'git add -A'
    sh 'git commit -v'
    sh 'git push origin gh-pages'
  end
end
{% endhighlight %}


あとキャッシュ系のプラグインは使ってなくて、新しい記事書くときは

    $ jekyll --auto --server --limit_posts 3

とかすれば対象の記事を絞れるので遅くならないし、デプロイのときは全記事出力するからちょっと遅いけど今160記事くらいで5秒程度だからまあ別に大丈夫かなと思ってる。でもコードハイライト多用してる場合はこういう問題もあるから注意。

[pygmentsが原因でjekyllが重くなってた - hokaccha.hamalog v2](http://d.hatena.ne.jp/hokaccha/20120808/1344436656)

というわけでJekyllおすすめ。
