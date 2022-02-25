import { gql } from '@apollo/client';

export const GET_ME = gql`

query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

// for graphix card => take the data we have and export it to a pdf 
// 