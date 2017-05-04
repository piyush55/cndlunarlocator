class LunarVehicleMapController < ApplicationController

  def index
    @vehicle_ids = Vehicle::IDS
  end

  def show
    vehicle = fetch_vehicle params[:id]
    render json: vehicle.to_json
  end

  private

  def fetch_vehicle id
    Vehicle.find(:one, from: "/vehicles/#{id}/locate.json")
  end
  
end
