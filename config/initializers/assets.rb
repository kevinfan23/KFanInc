# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

Rails.application.config.assets.precompile += %w( custom.css )
Rails.application.config.assets.precompile += %w( reset.css )
Rails.application.config.assets.precompile += %w( selectize.css )

Rails.application.config.assets.precompile += %w( modernizr.js )
Rails.application.config.assets.precompile += %w( jquery-2.1.4.js )
Rails.application.config.assets.precompile += %w( jquery.mobile.custom.min.js )
Rails.application.config.assets.precompile += %w( selectize.js )
Rails.application.config.assets.precompile += %w( home.js )
Rails.application.config.assets.precompile += %w( clock.js )
Rails.application.config.assets.precompile += %w( about.js )
Rails.application.config.assets.precompile += %w( jquery.simpleWeather.min.js )

Rails.application.config.assets.precompile += %w( logo1.png )
Rails.application.config.assets.precompile += %w( cd-arrowright1.svg )
Rails.application.config.assets.precompile += %w( wind.svg )
Rails.application.config.assets.precompile += %w( droplet.svg )
Rails.application.config.assets.precompile += %w( *.svg )


# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
