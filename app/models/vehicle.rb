class Vehicle < ActiveResource::Base
  self.site = "http://cndlunarlocator.herokuapp.com"

   IDS = %w{ 0 1 2 3 4 5 }

  def self.find_obj id
    find :one, from: "/vehicles/#{id}/locate.json"
  end
   
end
