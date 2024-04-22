/**
 * Script to read CSV data and insert in MongoDB database.
 * 
 *
 * CHANGE "user" and "password" in mongoDB connection string to.
 *
 * CHANGE filename to read from as needed.
 *
 * UNCOMMENT collection.insertOne() statement. Commented out to prevent accidental writes.
 *
 * CHANGE username to current admin's name, must be in User table though.
 *
 * Important info for CSV setup at end of this script.
 */

const { MongoClient } = require("mongodb");
const csv = require("csv-parser");
const fs = require("fs");
const { DateTime } = require("luxon");

//SET UP FILE NAME TO READ FROM
const filename = "data/spring2024.csv";

//SET UP COLLECTION TO INSERT DATA TO
const reservationCollection = "Reservation"; // Collection name in MongoDB

//Invoke insert data function
insertDataFromCSV(filename, reservationCollection);

// Function to connect to MongoDB
async function connectToMongoDB() {
  // PLACE YOUR USERNAME AND PASSWORD!
  const client = new MongoClient(
    "mongodb+srv://<USER>:<PASSWORD>@mongoverse.oyw8geb.mongodb.net/RoomWrangler"
  );
  await client.connect();
  return client.db("RoomWrangler");
}

// Function to insert data from CSV to MongoDB collection
async function insertDataFromCSV(filename, collection) {
  const db = await connectToMongoDB();
  //console.log("Connection to DB established.")  // for debugging
  const reservationCollection = db.collection("Reservation");

  let totalRows = 0;
  let parsedRows = 0;

  fs.createReadStream(filename)
    .pipe(csv())
    .on("data", async (row) => {
      totalRows++;
      const type = row["Booking Event Type"];
      const eventName = row["Booking Event Name"];
      const requestor = row["Requestor"];

      //parsing date and time to acceptable format
      const date = row["Booking Date"];
      const start = row["Reserved Start"];
      const end = row["Reserved End"];

      const startTime = parseDateTime(date, start);
      const endTime = parseDateTime(date, end);

      //getting IDs from other collections
      const room_id = await getRoomId(db, row["Room Code"].split("-")[1]);

      //CHANGE TO CURRENT ADMIN's NAME  //has to be in User DB
      const user_id = await getUserId(db, "<ADMIN NAME>");

      //Insert data ONLY if user_id is not NULL
      if (user_id) {
        //setting up data to insert in DB
        const input_dict = {
          userId: user_id,
          roomId: room_id,
          startTime: startTime,
          endTime: endTime,
          createdAt: new Date(),
          displayName: eventName,
          type: type,
          contactName: requestor,
        };

        // console.log(input_dict)    //debugging

        // INSERTING DATA TO COLLECTION
        // await reservationCollection.insertOne(input_dict);   //UNCOMMENT TO INSERT DATA

        parsedRows++;

        //console.log("Actually inserted: " + parsedRows + new Date());  //debugging

      } else {
        //error handling
        console.log(
          "user_id is null. Data not inserted and connection closed."
        );

        //closing connection to DB
        db.client.close();

        //ending the script
        process.exit(0);
      }

      if (parsedRows == totalRows) {
        console.log("CSV processed!");
        console.log("Total Rows: " + totalRows); // expect 2 w/ test.csv; 532 w/ spring2024.csv
        console.log("Rows Parsed: " + parsedRows);

        //closing connection to db
        db.client.close();

        //console.log("Connection to DB closed.")   //debugging

        //ending script with code 0
        process.exit(0);
      }

      //TO DO:
      //validation checks to handle overlapping reservations? [if we have time]
      //though given this data is through the registrar, overlaps shouldn't exist in the data in the first place
      //overlaps handled when user makes request through website
      //would be a safety measurr
    })
    .on("error", (error) => {
      // this handles any errors that occur when reading CSV

      console.log("An error has occurred!");
      console.log(error);

      //end the script
      process.exit(1);
    });
}

// Function to parse date and time from CSV row
function parseDateTime(dateString, timeString) {
  // parsing date and time strings from CSV row
  const [datePart] = dateString.split(" ");
  const [month, day, year] = datePart.split("/").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);

  // creating JavaScript Date object
  const date = new Date(year, month - 1, day, hours, minutes, 0); // months are zero-based

  return date;
}

// Function to get room ID from room number
async function getRoomId(database, number) {
  const roomCollection = database.collection("Room");
  const room = await roomCollection.findOne({ number: number });
  if (room) {
    return room._id;
  } else {
    return null;
  }
}

// Function to get user ID
async function getUserId(database, username) {
  //const db = await connectToMongoDB();
  const userCollection = database.collection("User");
  const user = await userCollection.findOne({ name: username });

  if (user) {
    return user._id;
  } else {
    return null;
  }
}

/**
 * NOTES FOR CSV:
 *
 * 1. If converting from spreadsheet, use normal CSV export settings
 * UTF-8 encoding can mess up data reading due to byte order mark.
 *
 * 2. Convert times to military time using formatting function on spreadsheet
 *
 * 3. Ensure columns names in CSV are same to how data is read in input
 *
 * 4. as of 04/22/2024: contact Marc Jacobsen to get data from EMS
 */
