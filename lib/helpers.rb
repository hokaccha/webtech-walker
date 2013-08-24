module Helpers
  def time_tag(date, format = '%Y年%m月%d日')
    "<time datetime=\"#{date.xmlschema}\">#{date.strftime(format)}</time>"
  end
end
