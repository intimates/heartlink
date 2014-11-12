namespace :seeds do
  desc 'Generate positive-negative database for Japanese words'
  task :pn_jp_words => :environment do
    require 'csv'
    CSV.foreach(File.expand_path('data/pn_ja_words.csv', Rails.root), 'r') do |row|
      word, kana, pos, value = row
      PnJpWord.create(word: word, kana: kana, pos: pos, value: value)
    end
  end

  namespace :user do
    desc 'Generate GUEST user and default messages'
    task :guest => :environment do
      guest = User.where(uid: '1').first_or_create(name: 'GUEST', provider: 'facebook')
      Message.generate_default_messages_for(guest)
    end

    desc 'Generate default messages for user with given uid'
    task :messages, [:uid] do |t, args|
      user = User.where(uid: args.first).first
      Message.generate_default_messages_for(user)
    end
  end
end
