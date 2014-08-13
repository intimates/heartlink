class Message < ActiveRecord::Base

  belongs_to :user, primary_key: 'uid', foreign_key: 'from_uid'

end
