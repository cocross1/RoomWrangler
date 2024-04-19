const { MongoClient } = require("mongodb");
const csv = require("csv-parser");
const fs = require("fs");
const { DateTime } = require("luxon");

// Function to connect to MongoDB
async function connectToMongoDB() {
  const client = new MongoClient(
    "mongodb+srv://kate:DQY76ySa2dfkF0Nc@mongoverse.oyw8geb.mongodb.net/RoomWrangler",
    {
      useUnifiedTopology: true,
    }
  );
  await client.connect();
  return client.db("RoomWrangler");
}

// Function to insert data from CSV to MongoDB collection
async function insertDataFromCSV(filename, collection) {
  const db = await connectToMongoDB();
  const reservationCollection = db.collection("Reservation");

  fs.createReadStream(filename)
    .pipe(csv())
    .on("data", async (row) => {
      const type = row["Type"];
      const requestor = row["Display Name"];

      //parsing date and time to acceptable format
      const date = row["Date"];
      const start = row["Start Time"];
      const end = row["End Time"];

      //parse date and time strings from CSV row
      const startTime = parseDateTime(date, start);
      const endTime = parseDateTime(date, end);

      //getting IDs from other collections
      const room_id = await getRoomId(row["Room"].split("-")[1]);
      const user_id = await getUserId("Yumna Ahmed"); //change to admin's name

      //setting up data to insert in DB
      const input_dict = {
        userId: user_id,
        roomId: room_id,
        startTime: startTime,
        endTime: endTime,
        createdAt: new Date(),
        type: type,
        displayName: requestor,
      };

      // INSERTING DATA TO COLLECTION
      //await reservationCollection.insertOne(input_dict);   //UNCOMMENT TO INSERT DATA
    })
    .on("end", () => {
      console.log("CSV file successfully processed");

      // TO DO: figure out closing connection + ending script not prematurely though

      // db.client.close();
      // process.exit(0);
    });
}

// Function to parse date and time from CSV row
function parseDateTime(dateString, timeString) {
  // Parse date and time strings from CSV row
  const [datePart] = dateString.split(' ');
  const [month, day, year] = datePart.split('/').map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);

  // creating JavaScript Date object
  const date = new Date(year, month - 1, day, hours, minutes, 0); // Month is zero-based

  return date;
}


// Function to get room ID from room number
async function getRoomId(number) {
  const db = await connectToMongoDB();
  const roomCollection = db.collection("Room");
  const room = await roomCollection.findOne({ number: number });
  if (room) {
    return room._id;
  } else {
    return null;
  }
}

// Function to get user ID
async function getUserId(username) {
  const db = await connectToMongoDB();
  const userCollection = db.collection("User");
  const user = await userCollection.findOne({ name: username });

  if (user) {
    // console.log(user._id)
    return user._id;
  } else {
    return null;
  }
}

// setting up filenames etc. 
const filename = "data/test.csv";
const reservationCollection = "Reservation"; // Collection name in MongoDB
insertDataFromCSV(filename, reservationCollection);
