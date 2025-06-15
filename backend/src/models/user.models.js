/* 
--------------------------------- Explanation -----------------------------------

In the code above, comments have been added to clarify the purpose and functionality of each section.

Import Statement: The comment explains that the mongoose library is being imported for MongoDB object modeling, which is essential for interacting with the database.

Schema Definition: The comment preceding the schema definition indicates that a schema for the User model is being created, which is a fundamental step in defining the structure of the data.

Field Comments: Each field within the schema has comments that describe the data type, whether the field is required, and any additional constraints (like uniqueness or minimum length). This provides clarity on the expected data format and validation rules.

Timestamps: The comment regarding timestamps explains that this feature automatically adds createdAt and updatedAt fields to the schema, which is useful for tracking record creation and modification times.

Model Creation: The comment before the model creation indicates that a User model is being created based on the defined schema, which is crucial for performing CRUD operations.

Export Statement: Finally, the comment explains that the User model is being exported for use in other parts of the application, ensuring that it can be utilized wherever needed.
*/

import mongoose from "mongoose"; // Importing mongoose library for MongoDB object modeling

// Defining a schema for the User model
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, // Specifying the data type as String
      required: true, // Making the email field mandatory
      unique: true, // Ensuring that each email is unique in the database
    },

    fullName: {
      type: String, // Specifying the data type as String
      required: true, // Making the fullName field mandatory
    },

    password: {
      type: String, // Specifying the data type as String
      required: true, // Making the password field mandatory
      minlength: 6, // Setting a minimum length of 6 characters for the password
    },

    profilePic: {
      type: String, // Specifying the data type as String
      default: "", // Setting a default value of an empty string for profilePic
    },
  },
  { timestamps: true } // Enabling timestamps for createdAt and updatedAt fields
);

// Creating a User model based on the userSchema
const User = mongoose.model("User", userSchema);

// Exporting the User model for use in other parts of the application
export default User;
