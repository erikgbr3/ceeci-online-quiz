import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import db from "../../../../database/models";

export default function handler(req, res) {
  switch (req.method) {

    case 'POST':
      return loginUser(req, res);

    default:
      res.status(400).json({ error: true, message: 'Petición errónea' });
  }
}
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Encuentra al usuario por su correo electrónico
    if (!email && !password) {
      return res.status(400).json({
        error: true,
        message: 'LLena ambos campos',
        errors: [
          {
            error: "El email es obligatorio",
            field: 'email'
          },
          {
            error: 'La contraseña es obligatoria',
            field: 'password'
          }
        ]
      });
    } else if (!password) {
      return res.status(400).json({
        error: true,
        message: 'la contraseña es obligatorio',
        errors: [
          {
            error: "La contraseña es obligatoria",
            field: 'password'
          }
        ]
      });
    } else if (!email) {
      return res.status(400).json({
        error: true,
        message: 'email es obligatorio',
        errors: [
          {
            error: "El email es obligatorio",
            field: "email"
          }
        ]
      });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: true,
        message: 'El formato del correo electrónico es inválido',
        errors: [
          {
            error: 'El formato del correo electrónico es inválido',
            field: 'email',
          },
        ],
      });
    }

    const user = await db.User.findOne({ 
      where: { email },
      attributes: ['id', 'name','email', 'password', 'rol']
    });
    if (!user) {
      return res.status(400).json({ error: true, message: "Este correo no ha sido registrado" })
    }

    // Verifica la contraseña
    if (user && bcrypt.compareSync(password, user.password)) {
      // Crea un token JWT
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.NEXTAUTH_SECRET, { expiresIn: '6h' });
      return res.setHeader('authorization', token).json({
        message: "Acceso Autorizado",
        token,
        user: {
          id: user.id,
          name: user.name,
          rol: user.rol
        }
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Contraseña Incorrecta',
        errors: [
          {
            error: "La contraseña es incorrecta",
            field: 'password'
          }
        ]
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(
      {
        error: true,
        message: `Ocurrio un error al procesar la petición: ${error.message}`
      }
    )
  }

}

