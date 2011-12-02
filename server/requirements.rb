#!/usr/bin/ruby
requirements = %w(
    now
    express
    node-uuid
    underscore
    jade
    mongoose
)

requirements.each do |req|
    `npm install #{req}`
end
