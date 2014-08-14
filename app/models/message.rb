class Message < ActiveRecord::Base
  acts_as_paranoid

  belongs_to :user, primary_key: 'uid', foreign_key: 'from_uid'

end
