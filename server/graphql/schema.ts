// Schema for sample GraphQL server.

// ----------------------
// IMPORTS

// GraphQL schema library, for building our GraphQL schema
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInputObjectType
} from "graphql";
import { GraphQLID, GraphQLBoolean, GraphQLInt } from "graphql/type/scalars";
import { GraphQLDate } from "graphql-iso-date";
import { GraphQLUpload } from "apollo-upload-server";

import resolvers from "./resolvers";

// ----------------------

// GraphQL can handle Promises from its `resolve()` calls, so we'll create a
// simple async function that returns a simple message.  In practice, `resolve()`
// will generally pull from a 'real' data source such as a database
const FieldType = new GraphQLObjectType({
  name: "Field",
  description: "Form field and message",
  fields() {
    return {
      field: {
        type: GraphQLString,
        resolve(obj) {
          return obj.field;
        }
      },
      message: {
        type: GraphQLString,
        resolve(obj) {
          return obj.message;
        }
      }
    };
  }
});

const Upload = GraphQLUpload;

const User = new GraphQLObjectType({
  name: "User",
  description: "User object",
  fields() {
    return {
      id: {
        type: GraphQLID
      },
      nametag: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      },
      email: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      },
      likes: {
        type: GraphQLString
      },
      comment_likes: {
        type: GraphQLString
      },
      image: {
        type: GraphQLString
      },
      small_image: {
        type: GraphQLString,
        resolve(user) {
          if (user.image !== null) {
            return (
              user.image.replace(/\..*$/, "") +
              "_small" +
              user.image.replace(/.*(?=\.)/, "")
            );
          } else {
            return null;
          }
        }
      },
      bio: {
        type: GraphQLString
      },
      mains: {
        type: GraphQLString
      },
      reddit: {
        type: GraphQLString
      },
      twitter: {
        type: GraphQLString
      },
      editor: {
        type: GraphQLBoolean
      },
      is_team: {
        type: GraphQLBoolean
      }
    };
  }
});

const Session = new GraphQLObjectType({
  name: "Session",
  description: "User session",
  fields() {
    return {
      ok: {
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve(obj) {
          return obj.ok;
        }
      },
      errors: {
        type: new GraphQLList(FieldType),
        resolve(obj) {
          return obj.errors;
        }
      },
      jwt: {
        type: GraphQLString,
        resolve(obj) {
          return obj.session && obj.session.jwt();
        }
      },
      user: {
        type: User,
        resolve(obj) {
          return obj.session && obj.session.getUser();
        }
      }
    };
  }
});

const Article = new GraphQLObjectType({
  name: "Article",
  description: "Article object",
  fields() {
    return {
      id: {
        type: GraphQLID
      },
      title: {
        type: GraphQLString
      },
      path: {
        type: GraphQLString
      },
      content: {
        type: GraphQLString
      },
      author: {
        type: User,
        resolve(obj) {
          return obj && obj.getAuthor();
        }
      },
      likes: {
        type: GraphQLInt
      },
      comments: {
        type: new GraphQLList(comment),
        resolve: async obj => {
          return obj && obj.getComments();
        }
      },
      createdAt: {
        type: GraphQLDate
      }
    };
  }
});

const Quote = new GraphQLObjectType({
  name: "Quote",
  description: "Quote object",
  fields() {
    return {
      id: {
        type: GraphQLID
      },
      quote: {
        type: GraphQLString
      },
      author: {
        type: GraphQLString
      }
    };
  }
});

const comment = new GraphQLObjectType({
  name: "Comment",
  description: "Comment object",
  fields() {
    return {
      id: {
        type: GraphQLID
      },
      articleID: {
        type: GraphQLString
      },
      author: {
        type: User,
        resolve(obj) {
          return obj && obj.getAuthor();
        }
      },
      message: {
        type: GraphQLString
      },
      likes: {
        type: GraphQLInt
      },
      createdAt: {
        type: GraphQLDate
      }
    };
  }
});

const SigninPayload = new GraphQLObjectType({
  name: "SigninPayload",
  description: "SignPayload object",
  fields() {
    return {
      token: {
        type: GraphQLString
      },
      user: {
        type: User
      }
    };
  }
});

const UploadFilePayload = new GraphQLObjectType({
  name: "UploadFilePayload",
  description: "UploadFilePayload object",
  fields() {
    return {
      path: {
        type: GraphQLString
      }
    };
  }
});

const Status = new GraphQLObjectType({
  name: "Status",
  description: "Status object",
  fields() {
    return {
      status: {
        type: GraphQLBoolean
      }
    };
  }
});

const AuthProviderSignupData = new GraphQLInputObjectType({
  name: "AuthProviderSignupData",
  fields() {
    return {
      email: {
        type: AUTH_PROVIDER_EMAIL
      },
      confirmPassword: {
        type: GraphQLString
      }
    };
  }
});

const AUTH_PROVIDER_EMAIL = new GraphQLInputObjectType({
  name: "AUTH_PROVIDER_EMAIL",
  fields() {
    return {
      email: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    };
  }
});

const Email = new GraphQLObjectType({
  name: "email",
  fields() {
    return {
      email: {
        type: GraphQLString
      }
    };
  }
});

// Root query.  This is our 'public API'.
const Query = new GraphQLObjectType({
  name: "Query",
  description: "Root query object",
  fields() {
    return {
      allUsers: {
        type: new GraphQLList(User),
        resolve: resolvers.allUsers
      },
      currentUser: {
        type: Session,
        resolve: resolvers.currentUser
      },
      allArticles: {
        type: new GraphQLList(Article),
        resolve: resolvers.allArticles
      },
      getRandomQuote: {
        type: Quote,
        resolve: resolvers.getRandomQuote
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields() {
    return {
      getUser: {
        type: User,
        args: {
          id: {
            type: GraphQLID
          },
          email: {
            type: GraphQLString
          },
          nametag: {
            type: GraphQLString
          }
        },
        resolve: resolvers.getUser
      },
      createUser: {
        type: SigninPayload,
        args: {
          nametag: {
            type: GraphQLString
          },
          authProvider: {
            type: AuthProviderSignupData
          },
          isOver13: {
            type: GraphQLBoolean
          },
          didAgree: {
            type: GraphQLBoolean
          }
        },
        resolve: resolvers.createUser
      },
      signinUser: {
        type: SigninPayload,
        args: {
          email: {
            type: AUTH_PROVIDER_EMAIL
          }
        },
        resolve: resolvers.signinUser
      },
      forgetPassword: {
        type: Status,
        args: {
          email: {
            type: GraphQLString
          }
        },
        resolve: resolvers.forgetPassword
      },
      getResetEmail: {
        type: Email,
        args: {
          id: {
            type: GraphQLID
          }
        },
        resolve: resolvers.getResetEmail
      },
      resetPassword: {
        type: SigninPayload,
        args: {
          email: {
            type: GraphQLString
          },
          password: {
            type: GraphQLString
          }
        },
        resolve: resolvers.resetPassword
      },
      updateUser: {
        type: SigninPayload,
        args: {
          nametag: {
            type: GraphQLString
          },
          name: {
            type: GraphQLString
          },
          email: {
            type: GraphQLString
          },
          password: {
            type: GraphQLString
          },
          image: {
            type: GraphQLString
          },
          bio: {
            type: GraphQLString
          },
          mains: {
            type: new GraphQLList(GraphQLString)
          },
          reddit: {
            type: GraphQLString
          },
          twitter: {
            type: GraphQLString
          }
        },
        resolve: resolvers.updateUser
      },
      searchArticle: {
        type: new GraphQLList(Article),
        args: {
          searchTerm: {
            type: GraphQLString
          }
        },
        resolve: resolvers.searchArticle
      },
      getArticle: {
        type: Article,
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: resolvers.getArticle
      },
      getArticlesByUser: {
        type: new GraphQLList(Article),
        args: {
          authorID: {
            type: GraphQLID
          }
        },
        resolve: resolvers.getArticlesByUser
      },
      likeArticle: {
        type: Article,
        args: {
          articleID: {
            type: GraphQLString
          },
          liked: {
            type: GraphQLBoolean
          }
        },
        resolve: resolvers.likeArticle
      },
      sendComment: {
        type: comment,
        args: {
          id: {
            type: GraphQLString
          },
          articleID: {
            type: GraphQLString
          },
          message: {
            type: GraphQLString
          }
        },
        resolve: resolvers.sendComment
      },
      likeComment: {
        type: comment,
        args: {
          id: {
            type: GraphQLString
          },
          articleID: {
            type: GraphQLString
          },
          liked: {
            type: GraphQLBoolean
          }
        },
        resolve: resolvers.likeComment
      },
      updateComment: {
        type: comment,
        args: {
          id: {
            type: GraphQLString
          },
          articleID: {
            type: GraphQLString
          },
          message: {
            type: GraphQLString
          }
        },
        resolve: resolvers.updateComment
      },
      deleteComment: {
        type: Status,
        args: {
          id: {
            type: GraphQLString
          },
          articleID: {
            type: GraphQLString
          }
        },
        resolve: resolvers.deleteComment
      },
      createArticle: {
        type: Article,
        args: {
          id: {
            type: GraphQLString
          },
          title: {
            type: GraphQLString
          },
          content: {
            type: GraphQLString
          },
          authorID: {
            type: GraphQLInt
          }
        },
        resolve: resolvers.createArticle
      },
      updateArticle: {
        type: Article,
        args: {
          id: {
            type: GraphQLString
          },
          title: {
            type: GraphQLString
          },
          content: {
            type: GraphQLString
          }
        },
        resolve: resolvers.updateArticle
      },
      deleteArticle: {
        type: Status,
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: resolvers.deleteArticle
      },
      uploadFile: {
        type: UploadFilePayload,
        args: {
          file: {
            type: Upload
          },
          where: {
            type: GraphQLString
          },
          articleID: {
            type: GraphQLString
          },
          main: {
            type: GraphQLBoolean
          },
          image: {
            type: GraphQLString
          }
        },
        resolve: resolvers.uploadFile
      },
      sendMail: {
        type: Status,
        args: {
          name: {
            type: GraphQLString
          },
          email: {
            type: GraphQLString
          },
          subject: {
            type: GraphQLString
          },
          message: {
            type: GraphQLString
          }
        },
        resolve: resolvers.sendMail
      }
    };
  }
});

// The resulting schema.  We insert our 'root' `Query` object, to tell our
// GraphQL server what to respond to.  We could also add a root `mutation`
// if we want to pass mutation queries that have side-effects (e.g. like HTTP POST)
export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  types: [
    User,
    Article,
    comment,
    SigninPayload,
    UploadFilePayload,
    Status,
    Upload,
    Email
  ]
});
