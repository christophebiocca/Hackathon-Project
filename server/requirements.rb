#!/usr/bin/ruby
requirements = %w(
    now
    express
    node-uuid
    underscore
	jade
)

requirements.each do |req|
    `npm install #{req}`
end
