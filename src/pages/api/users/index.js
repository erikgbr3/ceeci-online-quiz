import db from "../../../../database/models";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      return listUsers(req, res);
    case "POST":
      return addUsers(req, res);
    case "PUT":
      return editUsers(req, res);
    case "DELETE":
      return deleteUsers(req, res);

    default:
      res.status(400).json({ error: true, message: "Petición errónea" });
  }
}

// GET: usuarios
const listUsers = async (req, res) => {
  try {
    const { name } = req.query;
    const { userId } = req.query;
    const { rol } = req.query;
    let whereCondition = {}; 

    let users = []

  if (userId) {
      users = await db.User.findAll({
      where: {
          id:userId,
      },
      attributes: ['id', 'name', 'lastName', 'email', 'password', 'rol']
      });

      //console.log(users);
      if (Object.keys(users).length === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          return res.json({ users,message: 'Usuario encontrado' });
  }else if (name) {
      whereCondition = {
        [Op.or]: [{
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        {
          lastName: {
            [Op.like]: `%${name}%`,
          },
        }],
        
      };
    } else if (rol) {
      whereCondition = {
        rol: rol,
      };
    }
     users = await db.User.findAll({
      where: whereCondition,
      attributes: ['id','name', 'lastName', 'email', 'password', 'rol']
    });

    return res.json(users);
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: `Ocurrió un error al procesar la petición: ${error.message}`,
    });
  }
};



//POST: usuarios
const addUsers = async (req, res) => {
  const datosUsuario = { ...req.body };
  try {
    //validar que venga la contraseña
    /*if (!req.body.password) {
      return res.status(400).json({ message: "La contraseña es obligatoria" });
    }

    //datos del usuario

    // validar contrasena antes de cifrar
    if (datosUsuario.password.length < 8) {
      return res
      .status(400)
      .json({
        error: true,
        message: `Ocurrio un error al procesar la información`,
        errors: [
          {
            error: "La contrasena debe tener una longitud >= 8 carácteres.",
            field: 'password',
          }
        ],
      });
    }
    */
   
    //asegurar la contraseña
    //usar bcrypt
    //salt: generación de una cadena aleatoria deN longitud
    if(req.body.password){
      const salt = await bcrypt.genSalt(10);

      //cifrar la contraseña y meterla en los datos del usuario
      datosUsuario.password = await bcrypt.hash(datosUsuario.password, salt);
    }
    
    //guardar los datos del cliente
    const user = await db.User.create(datosUsuario);

    user.password = null; //evitar enviarlo en la respuesta

    res.json({ message: "El usuario ha sido registrado.", user });
  } catch (error) {

    let errors = [];
    if (error.errors) {
      //extraer la información de los campos que tienen error
      errors = error.errors.map((item) => ({
        error: item.message,
        field: item.path,
      }));
      
      if (datosUsuario.password.length < 8) {
        errors.push({
          error: "La contrasena debe tener una longitud >= 8 carácteres.",
          field: 'password',
        });
      }
    }
    return res
      .status(400)
      .json({
        error: true,
        message: `Ocurrio un error al procesar la información: ${error.message}`,
        errors,
      });
  }
};

//PUT: usuarios
const editUsers = async (req, res) => {
  try {
    const { id } = req.query;
    const { password, ...userData } = req.body;

    // if (password && password.length < 8) {
    //   return res.status(400).json({
    //     error: true,
    //     message: "La contraseña debe tener una longitud >= 8 caracteres.",
    //     field: "password",
    //   });
    // }

    // // Validar si se proporciona una nueva contraseña y cifrarla
    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   userData.password = await bcrypt.hash(password, salt);
    // }

    // if (!userData.name || !userData.lastName || !userData.phone || !userData.email || !userData.password || !userData.rol) {
    //   return res.status(400).json({
    //     error: true,
    //     message: "Faltan campos obligatorios para la actualización.",
    //   });
    // }

    await db.User.update(userData, {
      where: { id },
      attributes: ['id','name', 'lastName', 'email', 'password', 'rol']
    });

    res.json({
      message: "El usuario ha sido actualizado.",
    });
  } catch (error) {
    console.log(error);
    let errors = [];
    if (error.errors) {
      errors = error.errors.map((item) => ({
        error: item.message,
        field: item.path,
      }));
    }
    return res.status(400).json({
      error: true,
      message: `Ocurrió un error al procesar la información: ${error.message}`,
      errors,
    });
  }
};


//DELETE: usuarios
const deleteUsers = async (req, res) => {
  try {
    const { id } = req.query;

    // Verificar si el usuario existe antes de eliminarlo
    const user = await db.User.findOne({
      where: {
        id: id,
      },
      attributes: ['id','name', 'lastName', 'email', 'password', 'rol']
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "El usuario no existe.",
      });
    }

    // Eliminar el usuario existente
    await db.User.destroy({
      where: {
        id: id,
      },
      attributes: ['id','name', 'lastName', 'email', 'password', 'rol']
    });

    res.json({
      message: "El usuario ha sido eliminado.",
    });
  } catch (error) {
    console.log(error);
    let errors = [];
    if (error.errors) {
      errors = error.errors.map((item) => ({
        error: item.message,
        field: item.path,
      }));
    }
    return res.status(400).json({
      error: true,
      message: `Ocurrió un error al procesar la información: ${error.message}`,
      errors,
    });
  }
};