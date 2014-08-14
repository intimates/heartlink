class Api::V1::UsersController < Api::V1::ApplicationController
  before_action :cors_set_access_control_headers

  def index
    @users = User.all
    respond_to do |format|
      format.json { render json: @users, status: :ok }
    end
  end

  def show
    @user = User.find(params[:id])
    respond_to do |format|
      format.json { render json: @users, status: :ok }
    end
  end

end
