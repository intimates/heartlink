require 'rails_helper'

RSpec.describe Message, :type => :model do
  describe 'relation with User' do
    let(:user) { FactoryGirl.create(:user) }
    let(:message) { FactoryGirl.create(:message, from_uid: user.uid) }

    it 'belongs to a user' do
      expect(message.user).to eql(user)
    end
  end
end
