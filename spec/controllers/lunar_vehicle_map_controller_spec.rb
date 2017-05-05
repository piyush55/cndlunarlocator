require 'rails_helper'

RSpec.describe LunarVehicleMapController, type: :controller do

  describe "GET #index" do
    render_views
    
    it "loads vehicle ids into @vehicle_ids" do
      get :index
      expect(assigns(:vehicle_ids)).to match_array(%w{ 0 1 2 3 4 5 })
      expect(response.body).to match /<title>LunarApp/
      expect(response.body).to match /Select Vehicle/
    end  
  end

  describe "GET #show" do

    let(:vehicle) { FactoryGirl.build(:vehicle) }
    
    before :each do
      allow(controller).to receive(:fetch_vehicle).and_return(vehicle.attributes)
    end

    it 'should return vehicle by id' do
      get :show, params: { id: 0 }
      expect(response.body).to eq (vehicle.attributes.to_json)
    end

    it 'should return not found error with 404 status' do
      get :show, params: { id: 8 }
      expect(response.code).to eq '404'
      expect(JSON.parse(response.body)['error']).to eq 'Not Found'
    end
  end
end
