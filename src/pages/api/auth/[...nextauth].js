import { checkUserEmailPassword } from "../../../../database/models/autentication";
import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';

// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Nombre Usuario", type: "email", placeholder: "Usuario" },
        password: { label: "Contraseña", type: "password", placeholder: 'Contraseña' }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // se puede implementar una función que valide la credencial y devolver el usuario
        //const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        const user = await checkUserEmailPassword(credentials.email, credentials.password)
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return { ...user};
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
  
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  // rutas de las vistas
  pages: {
    signIn: '/login',
    error: '/login',
    //newUser: '/auth/register'
  },

  session: {
    maxAge: 86400, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },

  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      console.log("jwt");
      console.log({ token, account, user });
      if(user){        
      token.rolUser= user.rol;
      token.id = user.id;
      }       
      
      //token.userRole = "admin"
      return token
    },
    
    async session({ session, token, user }){
      //session.user = token.session?.user;
      session.user.rol = token.rolUser;
      session.user.id= token.id;

      return session;
    }
  },
}

export default NextAuth(authOptions)