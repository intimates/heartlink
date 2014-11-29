describe User do

  before(:each) { @user = FactoryGirl.create(:user) }

  subject { @user }

  it { should respond_to(:name) }

  it "#name returns a string" do
    expect(@user.name).to match 'Test User'
  end

  describe 'relation with Message' do
    let!(:message) { FactoryGirl.create(:message, to_uid: @user.uid) }

    it 'has many messages' do
      expect(@user.messages.first).to eql(message)
    end
  end

end
