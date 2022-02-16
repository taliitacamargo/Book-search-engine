// Define the query and mutation functionality to work with the Mongoose models.
const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require("../utils/auth");


const resolvers = {
    Query: {

        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user_id }).populate('books');
            }
            throw new AuthenticationError('You need to be logged in')
        },

    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this Email');
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect Password');
            }
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                const bookData = await User.findOneAndUpdate(
                    {
                        _id: context.user._id
                    },
                    {
                        $push: {
                            books: book
                        }
                    },
                    {
                        new: true,
                        runValidators: true,
                    },
                )
                return bookData;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const book = await Book.findOneAndDelete(
                    {
                        _id: bookId,
                    },
                    {
                        $pull: {
                            books: {
                                _id: bookId
                            },
                        },
                    },
                    {
                        new: true
                    }
                )
                return book
            }
            throw new AuthenticationError
        },
    },
};
module.exports = resolvers;