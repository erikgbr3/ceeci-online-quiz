import db from '../../../../database/models'
export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getQuestions (req, res);
    case 'POST':
    return addQuestions(req, res);

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
              include: ['QuestionBank', 'QuestionOption']
          });
      }else {
          questions = await db.Question.findAll({
              include: ['QuestionBank', 'QuestionOption']
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

// const addQuestions = async (req, res) =>  {
//     try {
  
//       const question = await db.Question.create({...req.body});
  
//       res.status(200).json({
//         question,
//         message: 'Registrado'
//       });
  
//     } catch (error) {
  
//       console.log(error);
  
//         let errors = [];
//         if (error.errors){
//           errors = error.errors.map((item) => ({
//             error: item.message,
//             field: item.path,
//         }));
//       }
//       return res.status(400).json( {
//         error: true,
//         message: `Ocurrió un error al procesar la petición: ${error.message}`,
//         errors,
//         } 
//       )
//     }
//   }


const addQuestions = async (req, res) =>  {
  const { options } = req.body;

  try {
    // Create the question
    const question = await db.Question.create({
      ...req.body
    });

    // Create options associated with the question
    if (options && Object.keys(options).some((key) => options[key].trim() !== '')) {
      const createdOptions = await db.Option.create({
        option1: options.option1,
        option2: options.option2,
        option3: options.option3,
        correctA: options.correctA,
        questionId: question.id, // link option to the question
      });

      // Associate the created options with the question
      await question.addQuestionOption(createdOptions);
    }

    res.status(200).json({
      question,
      message: 'Registrado',
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
      message: `Ocurrió un error al procesar la petición: ${error.message}`,
      errors,
    });
  }
};
