// Define the query and mutation functionality to work with the Mongoose models.
const { AuthenticationError } = require ('apollo-server-express');
const { User, Book } = require ('../models');
const { signToken } = require ("../utils/auth");


// const resolvers = {
//     Query: {
//         users: async () => {
//             return User.find().populate('books');
//         },
//         user: async (parent, {username}) => {
//             return User.findOne({username}).populate('thoughts');
//         },
//         books: async (parent,{username}) => {
//             const params = username ? {username} : {};
//             return Book.find(params).sort({createdAt: -1});
//         },
//         thought: async(parent, args, context) => {
//             if
//         }

//     }
// }