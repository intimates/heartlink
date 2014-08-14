require 'spec_helper'

describe 'Messages API v1', type: :request do
  describe 'GET /messages/:id' do
    let(:body) { 'Hello' }
    let(:message) { create(:message, body: body) }

    it 'returns message' do
      get "/api/v1/messages/#{message.id}", format: 'json'
      expect(response).to be_success
      json = JSON.parse(response.body)
      expect(json['body']).to eq(body)
    end

    it 'opens message' do
      get "/api/v1/messages/#{message.id}", format: 'json'
      expect(response).to be_success
      json = JSON.parse(response.body)
      expect(json['opened_at']).to_not be_nil
    end
  end
end
