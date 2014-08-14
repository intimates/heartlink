class Api::V1::UsersController < Api::V1::ApplicationController
  before_action :cors_set_access_control_headers

  def index
    @users = User.all
    render json: @users, status: :ok
  end

  def show
    @user = User.find(params[:id])
    render json: @user, status: :ok
  end

end
