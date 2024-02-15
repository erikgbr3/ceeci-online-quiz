import db from '../../../../database/models';

export default function handler(req, res) {

  switch(req.method) {

    case 'POST':
      return addBanks(req, res);
    case 'GET':
      return getBanks(req, res);
    case 'DELETE':
      return deleteBanks(req, res);
    case 'PUT':
      return updateBank(req,res);
    default:
      res.status(400).json({error: true, message:'Petición errónea, utiliza Read,Post,Put o Delete'});
  }
}

const addBanks = async (req, res) =>  {
  try {

    const bank = await db.Bank.create({...req.body});

    res.status(200).json({
      bank,
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

const getBanks = async (req, res) => {
  const roomId = req.query.roomId;

  try{
    //los datos vienen del req.body
    let banks;
    //guardar cliente
    if(roomId){
      banks = await db.Bank.findAll({
        where: {
          roomId: roomId
        },
        include: ['RoomBank']
      });
    }else {
      banks = await db.Bank.findAll({
        include: ['RoomBank']
      });
    }

    return res.json(banks)
    
  }catch(error){
    console.log(error);
    let errors = []

    if(error.errors){
      //extrae la info
      errors = error.errors.map((item) => ({
      error: item.message, 
        field: item.path,
      }));
    }

    return res.status(400).json({
      message: `Ocurrió un error al procesar la petición: ${error.message}`,
      errors,
    })
  }
}

const deleteBanks = async (req,res) => {
  try{
    const {id} = req.query;

    await db.Bank.destroy({
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

const updateBank = async (req,res) => {

    try{
      let {id} = req.query;
      await db.Bank.update({...req.body},
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
    })
  }
}