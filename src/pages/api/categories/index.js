import db from '../../../../database/models';

export default function handler (req, res) {
    switch (req.method) {
      case 'GET':
        return getCategory (req, res);
      case 'POST':
        return addCategory (req, res);
      case 'PUT':
        return updateCategory (req, res);
      case 'DELETE':
        return deleteCategory (req, res);
  
      default:
        res.status(400).json({ error: true, message: 'Petición errónea' });
    }
  }
  
  //GET Function
  const getCategory = async (req, res) => {
    try {
      let categories = [];
      if (categories) {
        categories = await db.Category.findAll({
          attributes: ['id', 'name'],
        })
      }

      return res.json(categories);
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
  const addCategory = async (req, res) => {
    try {
      
    } catch (error) {
      
    }
  }