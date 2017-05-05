require 'rails_helper'

RSpec.describe LunarVehicleMapController, type: :controller do
  describe "GET #index" do
    it "loads vehicle ids into @vehicle_ids" do
      get :index
      expect(assigns(:vehicle_ids)).to match_array(%w{ 0 1 2 3 4 5 })
     end  
  end

  describe "GET #show" do
    before :each do
      allow(controller).to receive(:fetch_vehicle).and_return({vehicle_id: 0, lat: 20.12454424344842 ,long: -152.9704486516219, name: 'Heuvos Rancheros', model: 'Rover TX 5', power_level_percent: 98 })
    end

    it 'should return vehicle by id' do
      get :show, params: { id: 0 }
      expect(response.body).to eq ({vehicle_id: 0, lat: 20.12454424344842 ,long: -152.9704486516219, name: 'Heuvos Rancheros', model: 'Rover TX 5', power_level_percent: 98 }.to_json)
    end
  end
end
