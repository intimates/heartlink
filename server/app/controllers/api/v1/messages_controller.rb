class Api::V1::MessagesController < Api::V1::ApplicationController
  protect_from_forgery with: :null_session

  before_action :authenticate
  before_action :set_message, only: [:show, :destroy]
  before_action :cors_set_access_control_headers

  def index
    messages = Message.today.where(to_uid: @user.uid)

    # FIXME: slow code, do this on SQL level (select except 'body' column)
    messages = messages.as_json.map do |message|
      message.reject { |k, v| k == 'body' }
    end

    render json: messages, status: :ok
  end

  def sent
    @messages = Message.where(from_uid: @user.uid)
    render json: @messages, status: :ok
  end

  def show
    @message.opened_at = Time.now
    @message.save
    render json: @message, status: :ok
  end

  # TODO: Authentication (now anyone can create new messages)
  def create
    @message = Message.new(message_params)
    @message.sent_at = Time.now
    if @message.save
      render text: 'message successfully created.', status: :created
    else
      render json: @message.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @message.destroy
    render json: {}, status: :ok
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
