import db from '../../../../database/models'
export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getQuestions (req, res);

    default:
      res.status(400).json({ error: true, message: 'Petición errónea' });
  }  
}

const getQuestions = async (req, res) => {

  const bankId = req.query.bankId;

  try{
      //los datos vienen del req.body
      let questions;
      //guardar cliente
      if(bankId){
          questions = await db.Question.findAll({
              where: {
                  bankId: bankId
              },
              include: ['QuestionBank']
          });
      }else {
          questions = await db.Question.findAll({
              include: ['QuestionBank']
          });
          
      }

      return res.json(questions)
  
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