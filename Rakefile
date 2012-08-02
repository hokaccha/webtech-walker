desc 'generate new posts'
task :post do
  print 'url: '
  url = STDIN.gets.strip

  print 'title: '
  title = STDIN.gets.strip

  print 'tags: '
  tags = STDIN.gets.strip

  tags = tags.split(',').map { |t| t.strip }
  if tags.size > 1
    tags = "\n" + tags.map{|t| "  - #{t}"}.join("\n")
  else
    tags = tags.pop
  end

  str = <<EOF
---
layout: posts
title: #{title}
tags: #{tags}
---

EOF

  filename = url.gsub(/(\d{4})\/(\d{2})\/(\d{2})(\d{6})/, '\1-\2-\3-\3\4')
  post_path = "src/_posts/#{filename}.md"

  raise "#{post_path} is exists" if File.exist?(post_path)

  File.write(post_path, str)
  puts "create #{post_path}"
end

task :asset do
  print 'url: '
  url = STDIN.gets.strip
  filename = url.gsub(/(\d{4})\/(\d{2})\/(\d{2})(\d{6})/, '\1-\2-\3-\3\4')
  sh "mkdir src/img/posts/#{filename}"
  sh "mkdir src/sample/#{filename}"
end
