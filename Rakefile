desc "Create new article with title"
task :article do
  title = ENV["title"] or raise "Error: title is reqiured!"
  now = Time.now
  filepath = "source/archive/#{now.strftime('%Y-%m-%d')}-#{title}.html.md"
  body = <<~BODY
    ---
    title:
    date: #{now.strftime('%Y-%m-%d %H:%M')} JST
    tags:
      -
    ---
  BODY

  File.write(filepath, body)
  puts "created: #{filepath}"
end

desc "Deploy to GitHub Pages"
task :deploy do
  sh "bundle exec middleman deply"
end

desc "Start development server"
task :server do
  sh "bundle exec middleman"
end
