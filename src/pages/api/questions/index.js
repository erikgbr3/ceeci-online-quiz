import db from '../../../../database/models'
export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getQuestions (req, res);
    case 'POST':
      return addQuestions(req, res);
    case 'PUT':
      return updateQuestions(req, res);
    case 'DELETE':
      return deleteQuestions(req, res);
    case 'PATCH': 
      return patchQuestions(req, res);

    default:
      res.status(400).json({ error: true, message: 'Petición errónea' });
  }  
}

const getQuestions = async (req, res) => {
  const { bankId, enabled } = req.query;

  try {
      let questions;

      if (bankId) {
          questions = await db.Question.findAll({
              where: {
                  bankId: bankId
              },
              include: ['QuestionBank', 'QuestionOption', 'QuestionAnswer']
          });
      } else if (enabled !== undefined) {
          questions = await db.Question.findAll({
              where: {
                  enabled: enabled === 'true'
              },
              include: ['QuestionBank', 'QuestionOption', 'QuestionAnswer']
          });
      } else {
          questions = await db.Question.findAll({
              include: ['QuestionBank', 'QuestionOption', 'QuestionAnswer']
          });
      }

      return res.json(questions);

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
          message: `Ocurrió un error al procesar la petición: ${error.message}`,
          errors,
      });
  }
};


//METODO MODIFICADOS PARA WEB//
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


const updateQuestions = async (req, res) => {
  const { id } = req.query;
  const { textQuestion, options } = req.body;

  try {
    // Find the question by ID
    const question = await db.Question.findByPk(id);

    // Check if the question exists
    if (!question) {
      return res.status(404).json({
        error: true,
        message: 'La pregunta no fue encontrada.',
      });
    }

    // Update the question details
    await question.update({
      textQuestion: textQuestion,
    });

    // Update options associated with the question
    if (
      options &&
      Object.keys(options).some((key) => {
        const optionValue = options[key];
        return typeof optionValue === 'string' && optionValue.trim() !== '';
      })
    ) {
      const existingOptions = await db.Option.findOne({
        where: {
          questionId: question.id,
        },
      });

      if (existingOptions) {
        // Update existing options
        await existingOptions.update({
          option1: options.option1,
          option2: options.option2,
          option3: options.option3,
          correctA: options.correctA,
          questionId: question.id,
        });
      } else {
        // If options do not exist, create new options
        const createdOptions = await db.Option.create({
          option1: options.option1,
          option2: options.option2,
          option3: options.option3,
          correctA: options.correctA,
          questionId: question.id,
        });

        // Associate the created options with the question
        await question.addQuestionOption(createdOptions);
      }
    }

    res.status(200).json({
      question,
      message: 'Pregunta actualizada exitosamente.',
    });
  } catch (error) {
    console.error(error);

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
//FIN DE METODOS MODIFICADOS//

const deleteQuestions = async (req, res) => {
  try {
      const { id } = req.query;

      const question = await db.Question.findOne({ where: { id: id } });
      if (!question) {
          return res.status(400).json({ error: true, message: 'No se encontró la pregunta' });
      }
          if (question) {
              const option = await db.Option.findOne({where: {questionId: question.id}});
              if (option){
                  await db.Answer.destroy({ where: { optionId: option.id } });
                  await db.Option.destroy({ where: { questionId: question.id } });
              }
              await db.Question.destroy({ where: { id: question.id } });
          }

      res.json({
          message: 'Eliminado'
      });
  } catch (error) {
      console.error('Error al eliminar la sala:', error);
      res.status(500).json({ error: 'Error interno del servidor al eliminar la sala', details: error.message });
  }
};

const patchQuestions = async (req,res) => {
    try{
        let {id} = req.query;
        await db.Question.update({...req.body},
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