module Helpers
  def time_tag(date, format = '%Y年%m月%d日')
    "<time datetime=\"#{date.xmlschema}\">#{date.strftime(format)}</time>"
  end

  def sorted_tags
    blog.tags.sort_by do |tag, articles|
      articles.sort_by { |article| article.date }.first.date
    end
  end
end
