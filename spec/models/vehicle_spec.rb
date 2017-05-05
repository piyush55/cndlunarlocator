require "rails_helper"

describe Vehicle do

  describe 'find obj' do
    it 'should return vehicle obj with given id' do
      response = Vehicle.find_obj 1
      expect(response.vehicle_id).to eq 1
    end
  end
  
end
