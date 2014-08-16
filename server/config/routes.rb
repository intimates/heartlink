Rails.application.routes.draw do
  resources :pn_jp_words

  resources :messages
  get '/sent_messages' => 'messages#sent'

  resources :users, :only => [:index, :show]
  root to: 'visitors#index'
  get '/auth/:provider/callback' => 'sessions#create'
  get '/signin' => 'sessions#new', :as => :signin
  get '/signout' => 'sessions#destroy', :as => :signout
  get '/auth/failure' => 'sessions#failure'

  namespace :admin do
    resources :messages
  end

  namespace :api do
    namespace :v1 do
      resources :messages, :only => [:index, :show, :create, :destroy]
      get '/sent_messages' => 'messages#sent'

      resources :users, :only => [:index, :show, :create]
    end
  end
end
