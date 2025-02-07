
# Receipt Processor API

This is a Node.js Express API that processes shopping receipts and calculates reward points based on predefined rules. The API assigns a unique receipt ID to each processed receipt and allows users to retrieve the earned points for a given receipt.

---

## Installation and Setup

### 1. Clone the Repository
To set up the project locally, clone the repository using Git:
```sh
git clone https://github.com/your-username/receipt-processor.git
cd receipt-processor
```

### 2. Install Dependencies
Ensure that you have Node.js installed, then install the required dependencies:
```sh
npm install
```

### 3. Start the Server
Run the following command to start the application:
```sh
node app.js
```
Once the server is running, the API will be accessible at:
```
http://localhost:3000
```

---

## Running the API with Docker

Docker allows you to run the API inside a container without installing Node.js or dependencies manually.

### **1. Build the Docker Image**
Ensure that Docker is installed and running, then execute:
```sh
docker build -t receipt-processor .
```

### **2. Run the Docker Container**
To start the API inside a container, run:
```sh
docker run -p 3000:3000 receipt-processor
```

### **3. Test the API in Postman**
Once the container is running, use **the same steps in Postman** as outlined above. The API will be available at:
```
http://localhost:3000
```

---

## Running the API Using Postman

To test this API, you can use **Postman**, which allows you to send requests and view responses in an easy-to-use interface.

### **1. Process a Receipt (POST Request)**

**Endpoint:**  
`POST /receipts/process`

**Purpose:**  
This endpoint processes a receipt and returns a unique receipt ID.

**Steps to Test in Postman:**
1. Open **Postman**.
2. Create a new **POST** request.
3. In the URL field, enter:
   ```
   http://localhost:3000/receipts/process
   ```
4. Click on the **"Body"** tab.
5. Select **"raw"** and change the format to **"JSON"**.
6. Copy and paste the following JSON request:
   ```json
   {
     "retailer": "Target",
     "purchaseDate": "2022-01-01",
     "purchaseTime": "14:33",
     "items": [
       {
         "shortDescription": "Gatorade",
         "price": "2.25"
       }
     ],
     "total": "9.00"
   }
   ```
7. Click **"Send"**.
8. You should receive a response like this:
   ```json
   { "id": "7fb1377b-b223-49d9-a31a-5a02701dd310" }
   ```
9. Copy the `"id"` from the response for the next request.

---

### **2. Retrieve Points for a Receipt (GET Request)**

**Endpoint:**  
`GET /receipts/{id}/points`

**Purpose:**  
This endpoint retrieves the total reward points earned for a given receipt.

**Steps to Test in Postman:**
1. Open **Postman**.
2. Create a new **GET** request.
3. In the URL field, enter:
   ```
   http://localhost:3000/receipts/{id}/points
   ```
   Replace `{id}` with the actual receipt ID you received in the previous step.
4. Click **"Send"**.
5. If the receipt ID is valid, you will receive a response like:
   ```json
   { "points": 28 }
   ```
6. If an invalid ID is used, you will receive:
   ```json
   { "error": "No receipt found for that ID." }
   ```

---



## Common Errors and Solutions

| Error Message | Possible Cause | Solution |
|--------------|---------------|----------|
| `"Invalid receipt format"` | Missing or incorrect fields in the request | Ensure the JSON request has all required fields. |
| `"No receipt found for that ID"` | ID not found in the database | Check if you are using the correct receipt ID. |
| `"Cannot connect to API"` | Server is not running | Make sure you have started the server (`node app.js`) or Docker container. |

---

