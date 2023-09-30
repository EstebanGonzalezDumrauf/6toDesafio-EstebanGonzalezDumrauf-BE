import passport from "passport";
import local from "passport-local"
import { userModel } from "../dao/models/user.js"
import { createHash, isValidPassword } from '../utils.js'
import gitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;
const GitHubStrategy = gitHubStrategy.Strategy;
export const initializePassport = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            const exists = await userModel.findOne({ email });
            if (exists) {
                console.log('El usuario ya existe')
                return done(null, false);
            };
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            };
            let result = await userModel.create(newUser);
            return done(null, result)
        } catch (error) {
            return done('Error al crear el usuario:' + error)
        }
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            let user = await userModel.findOne({ email: username });
            if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
                user = {
                    first_name: "Super Usuario",
                    last_name: "de CODER",
                    email: "adminCoder@coder.com",
                    rol: "Administrador"
                }
                return done(null, user);
            }
            if (!user) {
                console.log("No existe el usuario")
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.985dd587bc722915",
        clientSecret: "6de602882588e54cbabd1b906024a9c8b960f32a",
        callbackURL: "http://localhost:8080/api/sessions/githubCallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({ first_name: profile._json.name, email: profile._json.username });
            if (!user) {
                let newUser = {first_name: profile._json.name, email: profile._json.username};
                let result = await userModel.create(newUser);
                return done(null, result);
            }
            done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        if (user.email === "adminCoder@coder.com") {
            // Serialización especial para el usuario 'adminCoder@coder.com'
            done(null, { email: user.email, role: user.rol });
        } else {
            done(null, user._id);
        }
    });
    
    passport.deserializeUser(async (id, done) => {
        if (typeof id === 'object' && id.email === 'adminCoder@coder.com') {
            // Deserialización especial para el usuario 'adminCoder@coder.com'
            done(null, id);
        } else {
            const user = await userModel.findById(id);
            done(null, user);
        }
    });
    
    // passport.serializeUser((user,done)=> {
    //     done(null, user._id)
    // })

    // passport.deserializeUser(async (id,done) => {
    //     let user = await userModel.findById(id);
    //     done(null,user);
    // })
}