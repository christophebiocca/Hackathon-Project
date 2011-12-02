#!/usr/bin/ruby
puts "[#{10.times.collect{|k| ("a"..."z").collect{|v| "{\"k\":#{k}, \"v\":\"#{v}\"}"}}.join(",")}]"
