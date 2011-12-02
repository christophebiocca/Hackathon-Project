#!/usr/bin/ruby
requirements = %w(
    now
    express
    node-uuid
    underscore
    jade
    mongoose
    connect-form
    formidable
)

requirements.each do |req|
    `npm install #{req}`
end
