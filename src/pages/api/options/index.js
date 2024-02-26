import db from '../../../../database/models';

export default function handler (req, res) {
    switch (req.method) {
      case 'GET':
        return getOption (req, res);
      case 'POST':
        return addOption (req, res);
      case 'PUT':
        return updateOption (req, res);
      case 'DELETE':
        return deleteOption (req, res);
  
      default:
        res.status(400).json({ error: true, message: 'Petición errónea' });
    }
  }
  
  //GET Function
  const getOption = async (req, res) => {
    try {
      let options = [];
      if (options) {
        options = await db.Option.findAll({
          
          include: [
            {
              model: db.Question, // Asegúrate de incluir el modelo correcto
              as: 'OptionQuestion',
              attributes: [
                'id', 
                'textQuestion', 
                'bankId',
              ], // Incluye los atributos necesarios
            },
          ],
          attributes: [
            'id',
            'option1',
            'option2',
            'option3',
            'correctA',
            'questionId'
          ]
        })
      }

      return res.json(options);
    } catch (error) {
      console.log(error);

      return res.status(400).json(
        {
          error: true,
          message: `Ocurrio un error al procesar la peticion ${error.message}`
        }
      )
    }
  }
  
  //POST Function
  const addOption = async (req, res) => {
    try {
      
    } catch (error) {
      
    }
  }