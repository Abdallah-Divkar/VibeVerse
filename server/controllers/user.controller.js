// Test controller function
exports.test = (req, res) => {
  res.send("User controller is working!");
};

// Example function to list all users (mock data)
exports.list = (req, res) => {
  const mockUsers = [
    { id: 1, name: "User One", email: "userone@example.com" },
    { id: 2, name: "User Two", email: "usertwo@example.com" },
  ];
  res.json(mockUsers); // Send the mock data as a JSON response
};