class LunarVehicleMapController < ApplicationController

  def index
    @vehicle_ids = Vehicle::IDS
  end

  def show
    render json: { error: 'Not Found' }, status: 404 and return unless Vehicle::IDS.include? params[:id]
    vehicle = fetch_vehicle params[:id]
    render json: vehicle.to_json
    rescue Exception => e
      render json: { error: e.response.message }, status: e.response.code
  end

  private

  def fetch_vehicle id
    Vehicle.find_obj id
  end
  
end
