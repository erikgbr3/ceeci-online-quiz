import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){

        case 'POST':
            return addRooms(req, res);
        case 'GET':
            return getRooms(req, res);
        case 'DELETE':
            return deleteRooms(req, res);
        case 'PUT':
            return updateRooms(req,res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read,Post,Put o Delete'});
    }
}

const addRooms = async (req, res) =>  {
    try {

        const room = await db.Room.create({...req.body});

        res.status(200).json({
            room,
            message: 'Registrado'
        });

    } catch (error) {

        console.log(error);

        let errors = [];
        if (error.errors){
            errors = error.errors.map((item) => ({
                error: item.message,
                field: item.path,
                }));
        }
      return res.status(400).json( {
        error: true,
        message: `Ocurrió un error al procesar la petición: ${error.message}`,
        errors,
        } 
      )
    }
}

const getRooms = async (req, res) => {
    const userId = req.query.userId;

    try {
        let rooms;

        if (userId) {
            // Si se proporciona userId, buscar las salas asociadas a ese usuario
            rooms = await db.Room.findAll({
                where: {
                    userId: userId
                },
            });
        } else {
            // Si no se proporciona userId, obtener todas las salas
            rooms = await db.Room.findAll({
            });
        }

        // Devolver las salas encontradas
        return res.json(rooms);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const deleteRooms = async (req,res) => {
    try{
      const {id} = req.query;

        await db.Room.destroy({
            where: { id: id }
        })

        res.json({
            message: 'Eliminado'
        })

      }
         catch (error){
            res.status(400).json({ error: "error al momento de borrar el estado"})
    }
}

const updateRooms = async (req,res) => {

    try{
        let {id} = req.query;
        await db.Room.update({...req.body},
            {
            where :{ id : id }
        })
        res.json({
            message: 'Actualizado'
        })

      }
      catch (error) {

        console.log(error);

        let errors = [];
        if (error.errors){
            errors = error.errors.map((item) => ({
                error: item.message,
                field: item.path,
                }));
        }
      return res.status(400).json( {
        error: true,
        message: `Ocurrió un error al procesar la petición: ${error.message}`,
        errors,
        } 
      )
    }
}