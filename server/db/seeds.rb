# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'csv'

CSV.foreach(File.expand_path('../pn_ja_words.csv', __FILE__), 'r') do |row|
  word, kana, pos, value = row
  PnJpWord.create(word: word, kana: kana, pos: pos, value: value)
end
