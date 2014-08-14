class Api::V1::MessagesController < ApplicationController
  before_action :set_message, only: [:show]

  def show
    @message.opened_at = Time.now
    @message.save
    respond_to do |format|
      format.json { render json: @message, status: :ok }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params[:id])
    end

end
