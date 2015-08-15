#!/usr/bin/env ruby

require 'webrick'

class NoCacheFileHandler < WEBrick::HTTPServlet::FileHandler
  def prevent_caching response
    response['ETag'] = nil
    response['Last-Modified'] = Time.now + 100**4
    response['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = Time.now - 100**4
  end

  def do_GET request, response
    super
    prevent_caching response
  end
end

server = WEBrick::HTTPServer.new  :Port => 8080
server.mount '/', NoCacheFileHandler, Dir.pwd
trap('INT') { server.stop }
server.start
