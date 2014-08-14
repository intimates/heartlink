# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'csv'

User.create(name: 'Annette Arnold', uid: '1')
User.create(name: 'Debbie Snyder', uid: '2')
User.create(name: 'Rosa Mason', uid: '3')

my_uid = '688784467878364'

Message.create(from_uid: my_uid, to_uid: '1', body: 'me -> 1')
Message.create(from_uid: my_uid, to_uid: '2', body: 'me -> 2')
Message.create(from_uid: my_uid, to_uid: '3', body: 'me -> 3')
Message.create(from_uid: '1', to_uid: my_uid, body: '1 -> me')
Message.create(from_uid: '2', to_uid: my_uid, body: '2 -> me')
Message.create(from_uid: '3', to_uid: my_uid, body: '3 -> me')

CSV.foreach(File.expand_path('../pn_ja_words.csv', __FILE__), 'r') do |row|
  word, kana, pos, value = row
  PnJpWord.create(word: word, kana: kana, pos: pos, value: value)
end
