namespace :seeds do
  namespace :user do
    desc 'Generate GUEST user and default messages'
    task :guest => :environment do
      guest = User.where(uid: '1').first_or_create(name: 'GUEST', provider: 'facebook')
      Message.generate_default_messages_for(guest)
    end
  end
end
