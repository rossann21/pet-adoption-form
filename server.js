const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const databaseFile = path.join(__dirname, "database.json");

// Submit adoption application
app.post("/submit", (req, res) => {

    const newApplication = {
        id: Date.now(),
        fullName: req.body.fullName,
        age: req.body.age,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
        pet: req.body.pet,
        reason: req.body.reason
    };

    fs.readFile(databaseFile, "utf8", (err, data) => {

        if (err) {
            return res.status(500).send("Error reading database.");
        }

        let database = JSON.parse(data);

        database.applications.push(newApplication);

        fs.writeFile(
            databaseFile,
            JSON.stringify(database, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).send("Error saving application.");
                }

                // Get available pets
                const availablePets = database.pets.filter(
                    pet => pet.status === "Available"
                );

                let petCards = "";

                availablePets.forEach(pet => {
                    petCards += `
                        <div class="pet-info">
                            <h2>${pet.name}</h2>
                            <p><strong>Type:</strong> ${pet.type}</p>
                            <p><strong>Breed:</strong> ${pet.breed}</p>
                            <p><strong>Age:</strong> ${pet.age}</p>
                            <p><strong>Gender:</strong> ${pet.gender}</p>
                            <p><strong>Status:</strong> ${pet.status}</p>
                            <p>${pet.description}</p>
                        </div>
                    `;
                });

                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Adoption Information</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 30px;
                            }

                            .container {
                                max-width: 900px;
                                margin: auto;
                                background: white;
                                padding: 30px;
                                border-radius: 15px;
                                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                            }

                            h1 {
                                text-align: center;
                            }

                            .message {
                                background: #e8f5e9;
                                padding: 15px;
                                border-radius: 10px;
                                margin-bottom: 25px;
                            }

                            .pets {
                                display: grid;
                                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                                gap: 20px;
                            }

                            .pet-info {
                                border: 1px solid #ddd;
                                padding: 20px;
                                border-radius: 12px;
                                background: #fafafa;
                            }

                            .pet-info h2 {
                                margin-top: 0;
                            }

                            .info-box {
                                margin-top: 25px;
                                padding: 20px;
                                border-radius: 10px;
                                background: #f0f0f0;
                            }

                            button {
                                padding: 12px 20px;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                                margin-top: 15px;
                            }

                            a {
                                text-decoration: none;
                            }
                        </style>
                    </head>

                    <body>

                        <div class="container">

                            <h1>Application Submitted!</h1>

                            <div class="message">
                                <p>
                                    Thank you, <strong>${newApplication.fullName}</strong>!
                                </p>

                                <p>
                                    Your application to adopt
                                    <strong>${newApplication.pet}</strong>
                                    has been received.
                                </p>

                                <p>
                                    You can now check the pets that are currently available
                                    for adoption.
                                </p>
                            </div>

                            <h1>🐶 Available Dogs & 🐱 Cats</h1>

                            <div class="pets">
                                ${petCards}
                            </div>

                            <div class="info-box">

                                <h2>📅 When can you see the pets?</h2>

                                <p>
                                    Monday - Saturday: 9:00 AM - 5:00 PM
                                </p>

                                <p>
                                    Sunday: 10:00 AM - 3:00 PM
                                </p>

                                <p>
                                    It is recommended to contact the adoption center
                                    before visiting.
                                </p>

                                <h2>📍 Adoption Center</h2>

                                <p>
                                    Lastimosa Pet Adoption Center
                                </p>

                                <p>
                                    123 Pet Street, Manila, Philippines
                                </p>

                                <h2>💰 Adoption Information</h2>

                                <p>
                                    Adoption fees may vary depending on the pet.
                                    The fee helps cover food, shelter, and basic
                                    veterinary care.
                                </p>

                                <h2>📋 Basic Requirements</h2>

                                <ul>
                                    <li>Valid contact information</li>
                                    <li>Complete adoption application</li>
                                    <li>Suitable living environment</li>
                                    <li>Ability to properly care for the pet</li>
                                    <li>Interview with the adoption staff</li>
                                </ul>

                            </div>

                            <a href="/">
                                <button>← Back to Adoption Form</button>
                            </a>

                        </div>

                    </body>
                    </html>
                `);
            }
        );
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});