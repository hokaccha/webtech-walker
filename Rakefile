desc 'setup'
task :setup do
  sh 'rm -rf  _deploy'
  sh 'git clone git@github.com:hokaccha/webtech-walker.git _deploy'
  cd '_deploy' do
    sh 'git checkout gh-pages'
  end
end

desc 'deploy to production'
task :deploy do
  sh 'jekyll'
  sh 'rm -rf _deploy/*'
  sh 'cp -R _site/* _deploy'
  cd '_deploy' do
    sh 'git add -A'
    sh 'git commit -m "deploy"'
    sh 'git push origin gh-pages'
  end
end

desc 'create new post'
task :post do
  require 'date'
  content = <<EOF
---
layout: posts
title: 
tags: 
---
EOF
  print 'title: '
  title = STDIN.gets.strip

  filepath = "src/_posts/#{Date.today.to_s}-#{title}.md"

  raise "#{filepath} is exists" if File.exist?(filepath)

  File.write(filepath, content)
  puts "create #{filepath}"
end
