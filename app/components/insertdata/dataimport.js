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

  let totalRows = 0;
  let parsedRows = 0;

  fs.createReadStream(filename)
    .pipe(csv())
    .on("data", async (row) => {
      totalRows ++;
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

      //change to admin's name //has to be in User DB
      // TO DO: validation checks (if time allows)
      const user_id = await getUserId("Yumna Ahmed"); 

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

      console.log(input_dict)

      // INSERTING DATA TO COLLECTION
      await reservationCollection.insertOne(input_dict);   //UNCOMMENT TO INSERT DATA

      parsedRows++;

      console.log("Actually inserted: " + parsedRows + new Date());

      //TO DO: validation checks to handle overlapping reservations? [if we have time] 
      //though given this data is through the registrar, overlaps shouldn't exist in the data in the first place
      //overlaps handled when user makes request through website
      //would be a safety measurr

    })
    .on("end", () => {
      console.log("CSV file successfully processed at " + new Date());
      console.log("Total: " + totalRows); // expect 2
      console.log("Parsed: " + parsedRows);

      // TO DO: figure out closing connection 

      // Issue:
      // script ends prematurely

      //db.client.close();
      //console.log("Parsed after connection close: " + parsedRows)

      //process.exit(0);

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
