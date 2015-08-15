#!/usr/bin/env ruby

require 'chunky_png'
require 'json'

file = ARGV[0]
image = ChunkyPNG::Image.from_file(file)
height = image.dimension.height
width = image.dimension.width

character = 97
histogram = {}
rle = ''
last = nil
count = 0
total = 0

(0...height).each do |y|
  (0...width).each do |x|
    color = image[x,y]

    unless histogram.has_key? color
      histogram[color] = character.chr
      character += 1
    end

    last = color if last.nil?

    if last != color
      rle << "#{count}#{histogram[last]}"
      total += count
      last = color
      count = 0
    end

    count += 1
  end
end

rle << "#{count}#{histogram[last]}"
total += count

abort 'Missing data!' if total != width * height

histogram = histogram.invert
histogram.each do |key, color|
  histogram[key] = ChunkyPNG::Color.to_hex(color)
end

json = {
  width: width,
  height: height,
  data: rle,
  values: histogram
}

puts json.to_json
