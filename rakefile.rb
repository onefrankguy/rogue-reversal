#!/usr/bin/env ruby

require 'rake'
require 'rake/clean'
require 'autoprefixer-rails'

CLEAN.include 'game.zip'
CLEAN.include 'css/game.min.css'

task :default => :test

desc "Make sure the game isn't too big"
task :test => 'css/game.min.css' do
  sh 'zip -r game.zip . -i@manifest.txt'
  size = ::File.size('game.zip')
  puts "zip size: #{size} bytes (used #{percent size}%)"
  fail 'zip file too big!' if size > 13 * 1024
end

desc 'Publish to the website'
task :publish do
  sh 'rsync -avz --delete --files-from=manifest.txt ./ frankmitchell.org:/home/public/js13k2015/'
end

desc 'Run Autoprefixer on the CSS'
task :autoprefix => 'css/game.min.css'

file 'css/game.min.css' => 'css/game.css' do
  css = ::File.read('css/game.css')
  ::File.open('css/game.min.css', 'w') do |io|
    io << AutoprefixerRails.process(css)
  end
end

def percent size
  max = 13 * 1024
  (size.to_f / max.to_f * 100).to_i
end
