#webhook

# Step 1: Use an official Node.js runtime as a parent image
FROM node:16

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json files into the container
COPY package*.json ./

# Step 4: Install any needed dependencies inside the container
RUN npm install

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 6: Expose the port your app is running on (for example, port 3000)
EXPOSE 3000

# Step 7: Run the application when the container starts
CMD ["npm", "start"]
