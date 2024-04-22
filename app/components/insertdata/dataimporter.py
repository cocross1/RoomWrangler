import pymongo
import csv

from datetime import datetime

# connecting to MongoDB
client = pymongo.MongoClient(
    "mongodb+srv://kate:DQY76ySa2dfkF0Nc@mongoverse.oyw8geb.mongodb.net/RoomWrangler")

# Access database
db = client.RoomWrangler

# Access the collections
user_collection = db.User
reservation_collection = db.Reservation
room_collection = db.Room
building_collection = db.Building
account_collection = db.Account

# function to insert data from CSV to MongoDB collection

def insert_data_from_csv(filename, collection):
    with open(filename, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # collection.insert_one(row)
            date = row["Date"]
            type = row["Type"]
            # start = convert_date_time(date, row["Start Time"])
            # end = convert_date_time(date, row["End Time"])
            print(datetime(2024, 4, 17, 11, 30, 0))
            start = datetime(2024, 4, 17, 11, 30, 0)
            end = datetime(2024, 4, 17, 12, 30, 0)
            room_id = get_room_id((row["Room"]).split("-")[1])
            requestor = row["Display Name"]
            contact = row["Contact"]
            user_id = get_user_id("Yumna Ahmed")
            curr_time = datetime.now(tz=datetime.timezone.utc)
            input_dict = {"userId" : user_id,
                          "roomId" : room_id,
                          "startTime" : start,
                          "endTime" : end,
                          "createdAt" : curr_time,
                          "type" : type,
                          "displayName" : requestor
                          }
            print(input_dict)
            # collection.insert_one(input_dict)
            

# Function to get room_ID from room number
def get_room_id(number):
    room = room_collection.find_one({"number": number})
    if room:
        #print(room["_id"])
        return room["_id"]
    else:
        return None

# to get user id   
def get_user_id(username):
    # Assuming 'username' is the field you want to query against
    user_collection = db.User

    # Query for the user document by username
    user_document = user_collection.find_one({"username": username})

    # If user_document exists, return the user_id, otherwise return None
    if user_document:
        return user_document["user_id"]
    else:
        return None
    

# Function to convert date and time formats
def convert_date_time(date_str, time_str):

    # Parse CSV date string to datetime object
    csv_date = datetime.strptime(date_str, "%m/%d/%Y %a")
    csv_time = datetime.strptime(time_str, "%H:%M")

    # Combine date and time
    combined_datetime = datetime(
        year=csv_date.year,
        month=csv_date.month,
        day=csv_date.day,
        hour=csv_time.hour,
        minute=csv_time.minute
    )

    # Convert to BSON datetime
    bson_datetime = combined_datetime.timestamp() * 1000  # Convert to milliseconds
    return bson_datetime

# Example usage
csv_date = "01/01/2024 Mon"
csv_time = "11:30"

mongodb_datetime = convert_date_time(csv_date, csv_time)
print(mongodb_datetime)  # Output: "2024-01-01T11:30:00.000+00:00"


filename = "data/test.csv"

# # Example usage
insert_data_from_csv(filename, reservation_collection)
# insert_data_from_csv('reservations.csv', reservation_collection)
# insert_data_from_csv('rooms.csv', room_collection)
# insert_data_from_csv('buildings.csv', building_collection)
# insert_data_from_csv('accounts.csv', account_collection)

# TO REMOVE:
# Prepping the CSV:
# excel spreadsheet - format times to military
# ensure column names match/ coherent
# export as csv with first row as headers.
# add csv to data folder.
