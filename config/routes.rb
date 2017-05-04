Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'lunar_vehicle_map#index'

  resources :lunar_vehicle_map, only: [:index, :show]
end
