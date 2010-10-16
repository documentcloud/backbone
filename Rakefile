require 'rubygems'
require 'closure-compiler'

task :default => []

desc "rebuild the backbone-min.js files for distribution"
task :build do
  source = File.read 'backbone.js'
  File.open('backbone-min.js', 'w+') {|f| f.write Closure::Compiler.new.compress(source) }
end

desc "build the docco documentation"
task :doc do
   system "docco backbone.js"
end