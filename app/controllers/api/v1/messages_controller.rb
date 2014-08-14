class Api::V1::MessagesController < ApplicationController
  protect_from_forgery with: :null_session

  before_action :authenticate
  before_action :set_message, only: [:show]

  def index
    @messages = Message.where(to_uid: @user.uid)
    respond_to do |format|
      format.json { render json: @messages, status: :ok }
    end
  end

  def sent
    @messages = Message.where(from_uid: @user.uid)
    respond_to do |format|
      format.json { render json: @messages, status: :ok }
    end
  end

  def show
    @message.opened_at = Time.now
    @message.save
    respond_to do |format|
      format.json { render json: @message, status: :ok }
    end
  end

  # TODO: Authentication (now anyone can create new messages)
  def create
    @message = Message.new(message_params)
    @message.sent_at = Time.now
    respond_to do |format|
      if @message.save
        format.json { render text: 'message successfully created.', status: :created }
      else
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    def set_message
      @message = Message.find(params[:id])
    end

    def message_params
      params.require(:message).permit(:to_uid, :from_uid, :body, :raw_body)
    end

    def authenticate
      authenticate_or_request_with_http_token do |token, options|
        # TODO: Use token, not uid
        @user = User.find_by(uid: token)
      end
    end
end
