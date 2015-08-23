#!/usr/bin/env ruby

# velocity is in pixels per second
velocity = 600

# row hiight is in pixels
row_height = 40

# a room height is in pixels
room_height = 280

rows = (room_height.to_f / row_height.to_f).to_i

weapons = %w{
  bow
  sword
  potion
  key
}

css = []

weapons.each do |weapon|
  rows.times do |i|
    name = "#{weapon}-row#{i}"
    distance = room_height - (i * row_height)
    time = ((distance * 1000) / 600).to_i

    css << "@keyframes #{name} {"
    css << "  0% { transform: translate3d(0, 0, 0) }"
    css << "  100% { transform: translate3d(0, -#{distance}px, 0) }"
    css << "}"
    css << ".#{name} {"
    css << "  animation: #{name} #{time}ms linear 1;"
    css << "}"
  end
end

css = css.join("\n")
puts css
