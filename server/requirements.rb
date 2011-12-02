#!/usr/bin/ruby
requirements = %w(
    now
    express
    node-uuid
)

requirements.each do |req|
    `npm install #{req}`
end
