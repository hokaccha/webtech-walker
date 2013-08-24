require 'lib/helpers'
helpers Helpers

Time.zone = 'Tokyo'

activate :syntax

activate :blog do |blog|
  blog.layout = "_layouts/post"
  blog.permalink = "archive/:year/:month/:title.html"
  blog.sources = "archive/:year-:month-:day-:title.html"
  blog.default_extension = ".md"

  blog.taglink = "tags/:tag.html"
  blog.tag_template = "tag.html"
end

page '/atom.xml', :layout => false

set :layouts_dir, '_layouts'
set :partials_dir, '_partials'
set :css_dir, 'css'
set :js_dir, 'js'
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true

configure :development do
  sprockets.cache = ::Sprockets::Cache::FileStore.new("#{root}/.assets_cache")
  set :debug_assets, true
end

configure :build do
end
