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
        case 'PATCH':
            return patchRooms(req, res);
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
    const { userId, enabled } = req.query;

    try {
        let rooms;

        if (userId) {
            rooms = await db.Room.findAll({
                where: {
                    userId: userId
                },
            });
        } else if (enabled !== undefined) {
            rooms = await db.Room.findAll({
                where: {
                    enabled: enabled === 'true'
                },
            });
        } else {
            rooms = await db.Room.findAll();
        }

        // Devolver las salas encontradas
        return res.json(rooms);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const deleteRooms = async (req, res) => {
    try {
        const { id } = req.query;

        const room = await db.Room.findOne({ where: { id: id } });
        if (!room) {
            return res.status(400).json({ error: true, message: 'No se encontró la sala' });
        }

        const bank = await db.Bank.findOne({ where: { roomId: room.id } });
        if (bank) {
            const questions = await db.Question.findAll({ where: { bankId: bank.id } });
            for (const question of questions) {
                const options = await db.Option.findAll({ where: { questionId: question.id } });
                for (const option of options) {
                    await db.Answer.destroy({ where: { optionId: option.id } });
                }
                await db.Option.destroy({ where: { questionId: question.id } });
            }
            await db.Question.destroy({ where: { bankId: bank.id } });
        }

        await db.Bank.destroy({ where: { roomId: room.id } });
        await db.Room.destroy({ where: { id: room.id } });

        res.json({
            message: 'Eliminado'
        });
    } catch (error) {
        console.error('Error al eliminar la sala:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar la sala', details: error.message });
    }
};

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

const patchRooms = async (req,res) => {
    try{
        let {id} = req.query;
        await db.Room.update({...req.body},
            {
            where :{ id : id }
        })
        res.json({
            message: 'Cambiado  '
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

