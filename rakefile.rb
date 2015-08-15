#!/usr/bin/env ruby

require 'rake'
require 'rake/clean'

CLEAN.include 'game.zip'

task :default => :test

desc "Make sure the game isn't too big"
task :test do
  sh 'zip -r game.zip . -i@manifest.txt'
  size = ::File.size('game.zip')
  puts "zip size: #{size} bytes (used #{percent size}%)"
  fail 'zip file too big!' if size > 13 * 1024
end

def percent size
  max = 13 * 1024
  (size.to_f / max.to_f * 100).to_i
end
